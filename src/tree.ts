import {View} from './view';
import {registeredComponents} from './boot';
import {compileNode, compileAttributeBindingsOnRealElement} from './compile';
import {AttributeBinding, AttributeInterpolation} from './bindings';
import * as utils from './utils';

const stateKey = typeof Symbol === 'function' ? Symbol('atrilState') : utils.randomString();
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
export class State {
  real: Node = null;
  vm: ComponentVM = null;
  scope: any = null;
  // A view tracks the progress of asynchronously fetching a view by URL. While
  // it exists (while a template is unavailable), this state's node won't be
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

export function hasState(node: Node): boolean {
  return node.hasOwnProperty(stateKey);
}

export function getState(node: Node): State {
  if (hasState(node)) return node[stateKey];
  return null;
}

export function getOrAddState(node: Node): State {
  if (hasState(node)) return node[stateKey];
  node[stateKey] = new State();
  return node[stateKey];
}

function getScope(virtual: Node): any {
  let state = getState(virtual);
  if (state.scope) return state.scope;
  while (virtual = virtual.parentNode) {
    let state = getState(virtual);
    if (state.scope) return state.scope;
    if (state.vm) return state.vm;
  }
  return null;
}

export function phaseElements(virtual: Element, real: Element) {
  let state = getOrAddState(virtual);
  utils.assert(state.compiled, `expected the state during a phase to be compiled`);

  if (state.view) {
    // Ignore if view not ready. ToDo check if we need additional cleanup if failed.
    if (state.view.loading) return;
    if (state.view.failed) {
      // TODO check if we need additional cleanup here.
      return;
    }
    state.view = null;
    utils.assert(!!state.VM, 'have state.view without a state.VM:', state);
    // The vm must be created before phasing its child nodes in order to provide
    // the viewmodel.
    state.vm = Object.create(state.VM.prototype);
    state.vm.element = real;
    state.VM.call(state.vm);
  }

  phaseChildNodes(virtual, real);
  if (state.vm && typeof state.vm.onPhase === 'function') state.vm.onPhase();
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
    let state = getState(virtualChild);

    // Try to reuse a child or create a new one.
    if (!realChild || state.real !== realChild) {
      if (!state.real) {
        state.real = virtualChild.cloneNode();
      }
      real.insertBefore(state.real, realChild);
      realChild = state.real;
    }

    if (virtualChild instanceof Element && realChild instanceof Element) {
      compileAttributeBindingsOnRealElement(virtualChild, realChild);
      // Phase custom attributes on both children.
      phaseCustomAttributes(virtualChild, realChild);
      // Phase and sync static attributes.
      phaseAndSyncAttributeInterpolations(virtualChild, realChild);
    }
    // Phase and sync contents.
    phaseNodes(virtualChild, realChild);
  }
  // Remove any leftovers.
  while (real.childNodes.length > children.length) {
    real.removeChild(real.lastChild);
  }
}

function phaseTextNodes(virtual: Text, real: Text): void {
  let state = getState(virtual);
  if (state.textInterpolation) {
    let scope = getScope(virtual);
    let result = state.textInterpolation.call(scope, scope);
    if (virtual.textContent !== result) virtual.textContent = result;
    if (real.textContent !== result) real.textContent = result;
  }
}

function phaseTemplate(template: Element): boolean {
  let state = getState(template);
  let binding = state.moldBinding;
  binding.refreshState(template, state, getScope(template));
  return binding.phase();
}

function phaseAndUnpackTemplate(template: Element): Node[] {
  let needsCompilation = getState(template).moldBinding.isNew;
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

function phaseCustomAttributes(virtual: Element, real: Element): void {
  let state = getState(virtual);
  let bindings = state.attributeBindings;
  if (!bindings) return;

  for (let i = 0, ii = bindings.length; i < ii; ++i) {
    let binding = bindings[i];
    binding.refreshState(real, state, getScope(virtual));
    binding.phase();
  }
}

function phaseAndSyncAttributeInterpolations(virtual: Element, real: Element): void {
  let bindings = getState(virtual).attributeInterpolations;
  if (!bindings) return;

  for (let i = 0, ii = bindings.length; i < ii; ++i) {
    let binding = bindings[i];
    let scope = getScope(virtual);
    let result = binding.expression.call(scope, scope)

    // Shouldn't bother syncing to virtual. Or maybe move this code elsewhere.
    if (virtual.getAttribute(binding.name) !== result) {
      virtual.setAttribute(binding.name, result);
    }
    if (real.getAttribute(binding.name) !== result) {
      real.setAttribute(binding.name, result);
    }
  }
}
