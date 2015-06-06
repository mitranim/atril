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
  }
}

export function hasTrace(node: Node): boolean {
  return node.hasOwnProperty(traceKey);
}

export function getTrace(node: Node): Trace {
  if (hasTrace(node)) return node[traceKey];
  return null;
}

export function getOrAddTrace(node: Node): Trace {
  if (hasTrace(node)) return node[traceKey];
  // IE 10/11 workaround, see State.
  if (node instanceof Text && utils.msie) {
    let parentState = getTrace(node.parentNode);
    if (!parentState.msieChildTextNodes) parentState.msieChildTextNodes = [];
    parentState.msieChildTextNodes.push(node);
  }
  node[traceKey] = new Trace();
  return node[traceKey];
}

function getScope(virtual: Node): any {
  let trace = getTrace(virtual);
  if (trace.scope) return trace.scope;
  let node = virtual;
  while (node = node.parentNode) {
    let trace = getTrace(node);
    if (trace.vm) return trace.vm;
    if (trace.scope) return trace.scope;
  }
  return null;
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

    // Try to reuse a child or create a new one.
    if (!realChild || trace.real !== realChild) {
      if (!trace.real) {
        trace.real = virtualChild.cloneNode();
      }
      real.insertBefore(trace.real, realChild);
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
    let scope = getScope(virtual);
    let result = trace.textInterpolation.call(scope, scope);
    // Skip the virtual node update, refresh only the real node content.
    // if (virtual.textContent !== result) virtual.textContent = result;
    if (real.textContent !== result) real.textContent = result;
  }
}

function phaseTemplate(template: Element): boolean {
  let trace = getTrace(template);
  let binding = trace.moldBinding;
  if (!binding) return false;
  binding.refreshState(template, trace, getScope(template));
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
    binding.refreshState(real, trace, getScope(virtual));
    binding.phase();
  }
}

function phaseAndSyncAttributeInterpolations(virtual: Element, real: Element): void {
  let bindings = getTrace(virtual).attributeInterpolations;
  if (!bindings) return;

  for (let i = 0, ii = bindings.length; i < ii; ++i) {
    let binding = bindings[i];
    let scope = getScope(virtual);
    let result = binding.expression.call(scope, scope)

    // Skip updating the virtual node, only refresh the real one.
    // if (virtual.getAttribute(binding.name) !== result) {
    //   virtual.setAttribute(binding.name, result);
    // }
    if (real.getAttribute(binding.name) !== result) {
      real.setAttribute(binding.name, result);
    }
  }
}
