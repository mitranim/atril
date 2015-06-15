'use strict';
'Thou shalt not comment.';

import 'zone.js';
import * as utils from './utils';
import {View} from './view';
import {compileNode} from './compile';
import {registeredComponents, registeredAttributes} from './decorators';
import {Root, roots, Meta, flushQueue} from './tree';

let reflowStackDepth = 0;
const maxRecursiveReflows = 10;
let reflowScheduled: boolean = false;

const localZone = zone.fork({
  afterTask: function() {
    // zone.js automatically reruns a task after ≈1 s if the task throws. It
    // also hides all exceptions after the first during these retries. For us,
    // if a binding or component consistently throws during a phase, it causes
    // continuous reflows. To avoid that, we have to capture the exception.
    try {
      reflowStackDepth = 0;
      reflow();
      flushQueue();
    }
    catch (err) {utils.error(err)}
  }
});

export function scheduleReflow(): void {
  reflowScheduled = true;
}

function reflow() {
  reflowStackDepth++;
  if (reflowStackDepth >= maxRecursiveReflows) {
    throw new Error(`reached ${maxRecursiveReflows} recursive reflow phases, aborting`);
  }
  reflowWithUnlimitedStack();
  if (reflowScheduled) {
    reflowScheduled = false;
    reflow();
  }
}

function reflowWithUnlimitedStack(): void {
  for (let i = 0, ii = roots.length; i < ii; ++i) {
    let root = roots[i];
    if (!root.real.parentNode) {
      destroy(root.virtual);
      roots.splice(i, 1);
      continue;
    }
    Meta.getMeta(root.virtual).phase();
  }
}

function destroy(virtual: Element): void {
  let meta = Meta.getMeta(virtual);
  meta.destroy();
  let nodes = virtual.childNodes;
  for (let i = 0, ii = nodes.length; i < ii; ++i) {
    let node = nodes[i];
    if (node instanceof Element) destroy(node);
  }
}

export function bootstrap(): void {
  // IE10 compat: doesn't support `apply` for function expressions. Have to
  // define it in a statement.
  function boot(element: Element = document.body): void {
    utils.assert(element instanceof Element, `bootstrap expects an Element, got:`, element);
    // Don't register components twice.
    for (let root of roots) {
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

  let virtual = <Element>utils.cloneDeep(element);
  let meta = Meta.addRootMeta(virtual, element);

  if (VM) {
    meta.VM = VM;
    meta.view = new View(VM);
    // view should take care of transclusion
    meta.view.tryToCompile(virtual);
  }

  root.virtual = virtual;
  return root;
}
