'use strict';

import {View} from './view';
import {registeredComponents} from './boot';
import {compileNode} from './compile';
import {AttributeBinding, AttributeInterpolation} from './bindings';
import * as utils from './utils';

const traceKey = typeof Symbol === 'function' ? Symbol('atrilTrace') : utils.randomString();
export const roots: Root[] = [];
const neutralZone = zone.fork();

const queue = {
  traces: <Trace[]>[],
  plan(trace: Trace): void {
    if (!~queue.traces.indexOf(trace)) queue.traces.push(trace);
  },
  flush(timestamp: number): void {
    while (queue.traces.length) {
      let trace = queue.traces.shift();
      utils.assert(trace.virtual instanceof Element && (<Element>trace.virtual).tagName !== 'TEMPLATE',
                   `unexpected non-Element trace in queue:`, trace.virtual);
      syncChildNodes(<Element>trace.virtual, <Element>trace.real);
    }
  }
}

export function flushQueue(): void {
  neutralZone.run(() => {
    window.requestAnimationFrame(queue.flush);
  });
}

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
  VM: ComponentClass = null;
  scope: any = null;
  // A view tracks the progress of asynchronously fetching a view by URL. While
  // it exists (while a template is unavailable), this trace's node won't be
  // phased.
  view: View = null;
  // Allows to skip compilation on reflow.
  compiled: boolean = false;
  // Allows to skip render on reflow.
  synced: boolean = false;
  // Set by a mold as a promise to not modify the node or any of its
  // descendants. Allows us to skip recompilation of entire trees during phases.
  isDomImmutable: boolean = false;
  // A trace is marked as dynamic if it has any bindings.
  dynamic: boolean = false;
  // Closest ancestral dynamic trace.
  dynamicAncestor: Trace = null;
  // Descendant dynamic traces.
  dynamicDescendants: Trace[] = null;
  // True when the trace belongs to a root element.
  isRoot: boolean = false;

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
    // Repeated dynamic registration happens when compiling components with
    // bindings on them.
    if (this.dynamic) return;

    let trace = Trace.getDynamicAncestor(this.virtual);
    if (trace) {
      if (!trace.dynamicDescendants) trace.dynamicDescendants = [];
      utils.assert(!~trace.dynamicDescendants.indexOf(this), `unexpected second dynamic registration of trace:`, this);
      trace.dynamicDescendants.push(this);
      this.dynamicAncestor = trace;
    }
    this.dynamic = true;
  }

  insertScope(locals?: {}): void {
    // Insert into the chain.
    if (!this.dynamic) this.markDynamic();

    this.scope = this.scope || Object.create(this.getScope());

    if (locals != null && typeof locals === 'object') {
      for (let key in locals) this.scope[key] = locals[key];
    }
  }

  getScope(): any {
    if (this.scope) return this.scope;
    let trace = this;
    while (trace = trace.dynamicAncestor) {
      if (trace.vm) return trace.vm;
      if (trace.scope) return trace.scope;
    }
    return null;
  }

  // Must follow the sequence: (two elements?) -> init VMs -> phase attributes
  // -> phase child nodes.
  phase(): void {
    utils.assert(this.dynamic, `unexpected phase() call on a non-dynamic trace:`, this);

    if (this.virtual instanceof Text) {
      if (this.textInterpolation) this.phaseTextInterpolation();
    }

    if (this.virtual instanceof Element) {
      if (this.view) {
        // Ignore if view not ready.
        if (this.view.loading) return;
        if (this.view.failed) {
          // TODO check if we need additional cleanup here.
          return;
        }
        this.view = null;
        // The vm must be created before phasing its child nodes in order to provide
        // the viewmodel.
        this.vm = Object.create(this.VM.prototype);
        this.vm.element = <Element>this.real;
        this.VM.call(this.vm);
      }

      // Only phase attributes and molds on elements that belong to other
      // elements. This skips roots and elements cached but unused by a mold.
      if (this.virtual.parentNode instanceof Element) {
        if ((<Element>this.virtual).tagName === 'TEMPLATE') this.phaseMold();
        else {
          if (this.attributeInterpolations) this.phaseAttributeInterpolations();
          if (this.attributeBindings) this.phaseAttributeBindings();
        }
      }

      if (this.isRoot || this.virtual.parentNode instanceof Element) {
        if (this.dynamicDescendants) {
          for (let trace of this.dynamicDescendants) trace.phase();
        }
      }

      if ((<Element>this.virtual).tagName !== 'TEMPLATE') {
        if (!this.synced) queue.plan(this);
      }

      this.synced = true;
    }

    if (this.vm && typeof this.vm.onPhase === 'function') this.vm.onPhase();
  }

  phaseTextInterpolation(): void {
    let result = this.textInterpolation.call(this.real, this.getScope());
    if (this.real.textContent !== result) this.real.textContent = result;
  }

  phaseAttributeInterpolations(): void {
    let scope = this.getScope();
    for (let binding of this.attributeInterpolations) {
      let result = binding.expression.call(this.real, scope);
      if (binding.attr.value !== result) binding.attr.value = result;
    }
  }

  phaseAttributeBindings(): void {
    if (!this.attributeBindings.length) return;
    let scope = this.getScope();
    for (let binding of this.attributeBindings) {
      binding.refreshState(<Element>this.real, this);
      binding.phase();
    }
  }

  phaseMold(): void {
    let template = <TemplateElement>this.virtual;
    // Whether the mold needs recompilation and resync into the live DOM.
    let needsResync = !this.moldBinding || this.moldBinding.isNew;
    this.moldBinding.refreshState(template, this);
    if (this.moldBinding.phase()) needsResync = true;

    if (needsResync) {
      compileNode(template);
      // Schedule child node sync on the first non-template ancestor element.
      let node: Node = template;
      while (node = node.parentNode) {
        if (node instanceof Element && node.tagName !== 'TEMPLATE') {
          queue.plan(Trace.getTrace(node));
          break;
        }
      }
    }
  }

  destroy(): void {
    if (this.moldBinding) this.moldBinding.destroy();
    if (this.attributeBindings) {
      for (let binding of this.attributeBindings) binding.destroy();
    }
    if (this.vm && typeof this.vm.onDestroy === 'function') {
      this.vm.onDestroy();
    }
    delete this.virtual[traceKey];
    this.virtual = null;
    this.real = null;
    this.dynamicAncestor = null;
  }

  static hasTrace(virtual: Node): boolean {
    return virtual.hasOwnProperty(traceKey);
  }

  static getTrace(virtual: Node): Trace {
    if (Trace.hasTrace(virtual)) return virtual[traceKey];
    return null;
  }

  static getOrAddTrace(virtual: Node): Trace {
    if (Trace.hasTrace(virtual)) return virtual[traceKey];
    // IE 10/11 workaround, see State.
    if (virtual instanceof Text && utils.msie) {
      let parentState = Trace.getTrace(virtual.parentNode);
      if (!parentState.msieChildTextNodes) parentState.msieChildTextNodes = [];
      parentState.msieChildTextNodes.push(virtual);
    }
    virtual[traceKey] = new Trace(virtual);
    return virtual[traceKey];
  }

  static addRootTrace(virtual: Element, real: Element): Trace {
    utils.assert(virtual instanceof Element, `unexpected root trace addition to non-element:`, virtual);
    utils.assert(real instanceof Element, `unexpected root trace addition to non-element:`, virtual);
    let trace = new Trace(virtual, real);
    trace.isRoot = true;
    trace.markDynamic();
    virtual[traceKey] = trace;
    return trace;
  }

  static getDynamicAncestor(virtual: Node): Trace {
    let trace: Trace;
    while (virtual.parentNode) {
      virtual = virtual.parentNode;
      trace = Trace.getTrace(virtual);
      if (trace.dynamic) return trace;
    }
    return trace || null;
  }
}

function syncChildNodes(virtual: Node, real: Node): void {
  let children: Node[] = [];
  for (let i = 0, ii = virtual.childNodes.length; i < ii; ++i) {
    let child = virtual.childNodes[i];
    if (child instanceof Element && child.tagName === 'TEMPLATE') {
      children.push(...unpackMold(child));
    } else {
      children.push(child);
    }
  }
  // Compare the children side by side.
  for (var i = 0, ii = children.length; i < ii; ++i) {
    let virtualChild = children[i];
    let realChild = real.childNodes[i];
    let trace = Trace.getTrace(virtualChild);
    // Put the real child in position.
    if (realChild !== trace.real) {
      real.insertBefore(trace.real, realChild || null);
      realChild = trace.real;
    }
    // Sync the rest of the tree.
    if (virtualChild instanceof Element && realChild instanceof Element) {
      syncChildNodes(virtualChild, realChild);
    }
  }
  // Remove excess.
  while (real.childNodes.length > children.length) {
    real.removeChild(real.lastChild);
  }
}

// Unpacks a mold's contents after it's been compiled and phased.
function unpackMold(template: TemplateElement): Node[] {
  let nodes: Node[] = [];
  for (let i = 0, ii = template.childNodes.length; i < ii; ++i) {
    let child = template.childNodes[i];
    if (child instanceof Element && child.tagName === 'TEMPLATE') {
      nodes.push(...unpackMold(child));
    } else {
      nodes.push(child);
    }
  }
  return nodes;
}
