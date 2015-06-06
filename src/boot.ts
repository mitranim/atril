'use strict';
'Thou shalt not comment.';

import 'zone.js';
import * as utils from './utils';
import {View} from './view';
import {compileNode} from './compile';
import {Root, roots, getState, getOrAddState, phaseElements} from './tree';

const localZone = zone.fork({
  afterTask: function() {
    // zone.js automatically reruns a task after ≈1 s if the task throws. It
    // also hides all exceptions after the first during these retries. For us,
    // if a binding consistently throws during a phase, it causes continuous
    // reflows. To avoid that, we have to capture the exception.
    try {reflow()}
    catch (err) {utils.error(err)}
  }
});

let reflowScheduled: boolean = false;
export function scheduleReflow(): void {
  reflowScheduled = true;
}

let reflowStackDepth = 0;
const maxReflowStackDepth = 10;
function reflow() {
  reflowStackDepth++;
  if (reflowStackDepth >= maxReflowStackDepth) {
    throw new Error(`reached ${maxReflowStackDepth} recursive reflow phases, aborting`);
  }
  reflowWithUnlimitedStack();
  if (reflowScheduled) {
    reflowScheduled = false;
    reflow();
  }
  reflowStackDepth--;
}

function reflowWithUnlimitedStack(): void {
  for (let i = 0, ii = roots.length; i < ii; ++i) {
    let root = roots[i];
    if (!root.real.parentNode) {
      destroy(root.virtual);
      roots.splice(i, 1);
      continue;
    }
    phaseElements(root.virtual, root.real);
  }
}

function destroy(virtual: Element): void {
  let state = getState(virtual);
  state.destroy();
  let nodes = virtual.childNodes;
  for (let i = 0, ii = nodes.length; i < ii; ++i) {
    let node = nodes[i];
    if (node instanceof Element) destroy(node);
  }
}

export const registeredComponents: {[tagName: string]: ComponentClass} = Object.create(null);
export const registeredAttributes: {[attributeName: string]: Function} = Object.create(null);
export const registeredMolds: {[attributeName: string]: boolean} = Object.create(null);

export function bootstrap(): void {
  // IE10 compat: doesn't support `apply` for function expressions. Have to
  // define it in a statement.
  function boot(element: Element = document.body): void {
    utils.assert(element instanceof Element, `bootstrap expects an Element, got:`, element);
    // Don't register components twice.
    for (let i = 0, ii = roots.length; i < ii; ++i) {
      let root = roots[i];
      if (root.real === element) return;
    }

    let VM = registeredComponents[element.tagName.toLowerCase()];
    if (VM) {
      roots.push(createRootAt(element, VM));
      return;
    }

    // Child scan must be breadth-first because a child may register the current
    // element as a root. If we go depth-first, we may end up with a root that
    // is also a descendant of another root. So we need two passes over the
    // child list.
    let nodes = element.childNodes;
    // First pass.
    for (let i = 0, ii = nodes.length; i < ii; ++i) {
      let node = nodes[i];
      if (node instanceof Element) {
        // Check if there's a least one registered custom attribute for this
        // element (or a mold, if this is a template). Unlike the normal compile
        // process, this doesn't throw an error in case of mismatch.
        let attrs = node.attributes;
        for (let i = 0, ii = attrs.length; i < ii; ++i) {
          let attr = attrs[i];
          if (utils.looksLikeCustomAttribute(attr.name)) {
            if (utils.customAttributeName(attr.name) in registeredAttributes) {
              let root = createRootAt(element);
              compileNode(root.virtual);
              roots.push(root);
              return;
            }
          }
        }
      }
    }
    // Second pass.
    for (let i = 0, ii = nodes.length; i < ii; ++i) {
      let node = nodes[i];
      if (node instanceof Element) boot(node);
    }
  }
  utils.onload(() => {localZone.run(boot)});
}

function createRootAt(element: Element, VM?: ComponentClass): Root {
  let root = new Root();
  root.real = element;

  if (VM) {
    let virtual: Element = (<any>element).cloneNode(true);
    let state = getOrAddState(virtual);
    state.real = element;
    state.VM = VM;
    state.view = new View(VM);
    // view should take care of transclusion
    state.view.tryToCompile(virtual);
    root.virtual = virtual;
  }
  // If we're instantiating a non-component, move its real child nodes to the
  // virtual DOM.
  else {
    let virtual = element.cloneNode();
    while (element.hasChildNodes()) {
      virtual.appendChild(element.removeChild(element.firstChild));
    }
    let state = getOrAddState(virtual);
    state.real = element;
    root.virtual = virtual;
  }

  return root;
}

export function Component(config: ComponentConfig) {
  let tagRegex = /^[a-z][a-z-]*[a-z]$/;

  // Type checks.
  utils.assert(typeof config.tagName === 'string', `expected a string tagname, got:`, config.tagName);
  utils.assert(tagRegex.test(config.tagName), `the tagname must match regex ${tagRegex}, got:`, config.tagName);

  return function(VM: ComponentClass) {
    utils.assert(typeof VM === 'function', `expected a component class, got:`, VM);
    utils.assert(!registeredComponents[config.tagName],
                 `unexpected redefinition of component with tagname ${config.tagName}`);
    registeredComponents[config.tagName] = VM;
  };
}

export function Attribute(config: AttributeConfig) {
  let nameRegex = /^[a-z][a-z-]*[a-z]$/;

  // Type checks.
  utils.assert(typeof config.attributeName === 'string',
                 `expected a string attribute name, got:`, config.attributeName);
  utils.assert(nameRegex.test(config.attributeName),
                 `the attribute name must match regex ${nameRegex}, got:`, config.attributeName);
  utils.assert(!registeredAttributes[config.attributeName],
                 `unexpected redefinition of attribute ${config.attributeName}`);

  return function(VM: Function) {
    utils.assert(typeof VM === 'function', `expected an attribute class, got:`, VM);
    registeredAttributes[config.attributeName] = VM;
  };
}

export function Mold(config: AttributeConfig) {
  return function(VM: Function) {
    Attribute(config)(VM);
    registeredMolds[config.attributeName] = true;
  };
}
