'use strict';

import {View} from './view';
import {registeredComponents} from './boot';
import {compileNode, compileAttributeBindingsOnRealElement} from './compile';
import {AttributeBinding, AttributeInterpolation} from './bindings';
import * as utils from './utils';

const traceKey = typeof Symbol === 'function' ? Symbol('atrilTrace') : utils.randomString();
export const roots: Root[] = [];

// A Root is a start of a virtual DOM hierarchy. It may be any element.
// Doesn't have to have a viewmodel.
export class Root {
  virtual: Element = null;
  real: Element = null;
}

// A State belongs to a virtual node and stores all of our private data relevant
// to that node. Each node in the virtual DOM receives a State either during
// bootstrap or during compilation.
export class Trace {
  virtual: Node = null;
  real: Node = null;
  vm: ComponentVM = null;
  scope: any = null;
  // A view tracks the progress of asynchronously fetching a view by URL. While
  // it exists (while a template is unavailable), this trace's node won't be
  // phased.
  view: View = null;
  compiled: boolean = false;
  VM: ComponentClass = null;
  // Set by a mold as a promise to not modify the node or any of its
  // descendants. Allows us to skip recompilation of entire trees during phases.
  isDomImmutable: boolean = false;
  // A trace is marked as dynamic if it has any bindings.
  dynamic: boolean = false;
  // Closest ancestral dynamic trace.
  ancestorTrace: Trace = null;
  // Descendant dynamic traces.
  descendantTraces: Trace[] = null;

  textInterpolation: TextExpression = null;
  attributeInterpolations: AttributeInterpolation[] = null;
  attributeBindings: AttributeBinding[] = null;
  moldBinding: AttributeBinding = null;

  // Workaround for an IE10/11 problem where the browser removes non-standard
  // properties from text nodes (instances of Text). The problem is prevented if
  // references to those text nodes are kept _somewhere_ in the JavaScript code.
  // The reference also can't be held by the trace associated with the text node
  // in question, so we keep it on the parent trace to give it a good chance of
  // being automatically garbage collected when this branch is destroyed. This
  // should never be used by our JS code — it exists solely to keep references.
  msieChildTextNodes: Text[] = null;

  constructor(virtual: Node, real?: Node) {
    this.virtual = virtual;
    if (real) {
      this.real = real;
    }
    // Unicorn creates its own horn
    else if (!(virtual instanceof Element && virtual.tagName === 'TEMPLATE')) {
      this.real = virtual.cloneNode();
    }
  }

  markDynamic(): void {
    utils.assert(!this.ancestorTrace, `unexpected second dynamic registration of trace:`, this);
    let trace = getAncestorDynamicTrace(this.virtual);
    if (trace) {
      if (!trace.descendantTraces) trace.descendantTraces = [];
      utils.assert(!~trace.descendantTraces.indexOf(this), `unexpected second dynamic registration of trace:`, this);
      trace.descendantTraces.push(this);
      this.ancestorTrace = trace;
    }
    this.dynamic = true;
  }

  insertScope(locals?: {}): void {
    this.scope = this.scope || Object.create(this.getScope());
    if (locals != null && typeof locals === 'object') {
      for (let key in locals) this.scope[key] = locals[key];
    }
    if (!this.dynamic) this.markDynamic();
  }

  getScope(): any {
    if (this.scope) return this.scope;
    let trace = this;
    while (trace = trace.ancestorTrace) {
      if (trace.vm) return trace.vm;
      if (trace.scope) return trace.scope;
    }
    return null;
  }

  destroy(): void {
    if (this.moldBinding) this.moldBinding.destroy();
    if (this.attributeBindings) {
      for (let i = 0, ii = this.attributeBindings.length; i < ii; ++i) {
        this.attributeBindings[i].destroy();
      }
    }
    if (this.vm && typeof this.vm.onDestroy === 'function') {
      this.vm.onDestroy();
    }
    delete this.virtual[traceKey];
    this.virtual = null;
    this.real = null;
    this.ancestorTrace = null;
  }
}

export function hasTrace(virtual: Node): boolean {
  return virtual.hasOwnProperty(traceKey);
}

export function getTrace(virtual: Node): Trace {
  if (hasTrace(virtual)) return virtual[traceKey];
  return null;
}

export function getOrAddTrace(virtual: Node): Trace {
  if (hasTrace(virtual)) return virtual[traceKey];
  // IE 10/11 workaround, see State.
  if (virtual instanceof Text && utils.msie) {
    let parentState = getTrace(virtual.parentNode);
    if (!parentState.msieChildTextNodes) parentState.msieChildTextNodes = [];
    parentState.msieChildTextNodes.push(virtual);
  }
  virtual[traceKey] = new Trace(virtual);
  return virtual[traceKey];
}

export function addRootTrace(virtual: Element, real: Element): Trace {
  utils.assert(virtual instanceof Element, `unexpected root trace addition to non-element:`, virtual);
  utils.assert(real instanceof Element, `unexpected root trace addition to non-element:`, virtual);
  let trace = new Trace(virtual, real);
  trace.markDynamic();
  virtual[traceKey] = trace;
  return trace;
}

function getAncestorDynamicTrace(virtual: Node): Trace {
  let trace: Trace;
  while (virtual.parentNode) {
    virtual = virtual.parentNode;
    trace = getTrace(virtual);
    if (trace.dynamic) return trace;
  }
  return trace || null;
}

// Must follow the sequence: (two elements?) -> init VMs -> phase attributes ->
// phase child nodes.
export function phaseElements(virtual: Element, real: Element): void {
  let trace = getOrAddTrace(virtual);
  utils.assert(trace.compiled, `expected the trace during a phase to be compiled`);

  if (trace.view) {
    // Ignore if view not ready.
    if (trace.view.loading) return;
    if (trace.view.failed) {
      // TODO check if we need additional cleanup here.
      return;
    }
    trace.view = null;
    utils.assert(!!trace.VM, 'have trace.view without a trace.VM:', trace);
    // The vm must be created before phasing its child nodes in order to provide
    // the viewmodel.
    trace.vm = Object.create(trace.VM.prototype);
    trace.vm.element = real;
    trace.VM.call(trace.vm);
  }

  // Currently also tries to phase attributes on a root, must fix.
  compileAndPhaseAttributes(virtual, real);

  phaseChildNodes(virtual, real);
  if (trace.vm && typeof trace.vm.onPhase === 'function') trace.vm.onPhase();
}

function phaseNodes(virtual: Node, real: Node): void {
  if (virtual instanceof Text && real instanceof Text) {
    phaseTextNodes(virtual, real);
    return;
  }
  if (virtual instanceof Element && real instanceof Element) {
    phaseElements(virtual, real);
    return;
  }
}

function phaseChildNodes(virtual: Node, real: Node): void {
  let children: Node[] = [];
  for (let i = 0, ii = virtual.childNodes.length; i < ii; ++i) {
    let child = virtual.childNodes[i];
    if (child instanceof Element && child.tagName === 'TEMPLATE') {
      children.push(...phaseAndUnpackTemplate(child));
    } else {
      children.push(child);
    }
  }
  // Compare the children side by side.
  for (var i = 0, ii = children.length; i < ii; ++i) {
    let virtualChild = children[i];
    let realChild = real.childNodes[i];
    let trace = getTrace(virtualChild);

    // Put the real child in position.
    if (realChild !== trace.real) {
      real.insertBefore(trace.real, realChild || null);
      realChild = trace.real;
    }
    // Phase and sync contents.
    phaseNodes(virtualChild, realChild);
  }
  while (real.childNodes.length > children.length) {
    real.removeChild(real.lastChild);
  }
}

function phaseTextNodes(virtual: Text, real: Text): void {
  let trace = getTrace(virtual);
  if (trace.textInterpolation) {
    let scope = trace.getScope();
    let result = trace.textInterpolation.call(scope, scope);
    // Skip the virtual node update, refresh only the real node content.
    if (real.textContent !== result) real.textContent = result;
  }
}

function phaseTemplate(template: Element): boolean {
  let trace = getTrace(template);
  let binding = trace.moldBinding;
  if (!binding) return false;
  binding.refreshState(template, trace, trace.getScope());
  return binding.phase();
}

function phaseAndUnpackTemplate(template: Element): Node[] {
  let trace = getTrace(template);
  let needsCompilation = !trace.moldBinding || trace.moldBinding.isNew;
  if (phaseTemplate(template)) needsCompilation = true;
  if (needsCompilation) compileNode(template);

  let nodes: Node[] = [];
  for (let i = 0, ii = template.childNodes.length; i < ii; ++i) {
    let child = template.childNodes[i];
    if (child instanceof Element && child.tagName === 'TEMPLATE') {
      nodes.push(...phaseAndUnpackTemplate(child));
    } else {
      nodes.push(child);
    }
  }
  return nodes;
}

function compileAndPhaseAttributes(virtual: Element, real: Element): void {
  compileAttributeBindingsOnRealElement(virtual, real);
  // Phase custom attributes on both children.
  phaseCustomAttributes(virtual, real);
  // Phase and sync static attributes.
  phaseAndSyncAttributeInterpolations(virtual, real);
}

function phaseCustomAttributes(virtual: Element, real: Element): void {
  let trace = getTrace(virtual);
  let bindings = trace.attributeBindings;
  if (!bindings) return;

  for (let i = 0, ii = bindings.length; i < ii; ++i) {
    let binding = bindings[i];
    binding.refreshState(real, trace, trace.getScope());
    binding.phase();
  }
}

function phaseAndSyncAttributeInterpolations(virtual: Element, real: Element): void {
  let trace = getTrace(virtual);
  let bindings = trace.attributeInterpolations;
  if (!bindings) return;

  for (let i = 0, ii = bindings.length; i < ii; ++i) {
    let binding = bindings[i];
    let scope = trace.getScope();
    let result = binding.expression.call(scope, scope)
    // Skip updating the virtual node, only refresh the real one.
    if (binding.attr.value !== result) binding.attr.value = result;
  }
}
