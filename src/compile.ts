'use strict';

import {registeredComponents, registeredAttributes, registeredMolds} from './boot';
import {Meta} from './tree';
import {AttributeBinding, AttributeInterpolation, hasInterpolation, compileExpression, compileInterpolation} from './bindings';
import {View} from './view';
import * as utils from './utils';

export function compileNode(node: Node): void {
  if (node instanceof Text) {
    compileTextNode(node);
    return;
  }
  if (node instanceof Element) {
    compileElement(node);
    return;
  }
  // A meta should always be made available, even for comments.
  Meta.getOrAddMeta(node);
}

function compileTextNode(node: Text): void {
  let meta = Meta.getOrAddMeta(node);
  if (meta.isDomImmutable && meta.compiled) return;
  if (hasInterpolation(node.textContent)) {
    meta.markDynamic();
    meta.textInterpolation = compileInterpolation(node.textContent);
    // Wipe text content of the real node to prevent curlies from leaking
    // into the view.
    meta.real.textContent = '';
  }
  meta.compiled = true;
}

function compileElement(element: Element): void {
  let meta = Meta.getOrAddMeta(element);
  // Allows us to skip recompilation of nodes returned from molds. Molds are
  // expected to explicitly mark their children as immutable. Child molds can't
  // be considered immutable in the compilation sense because parent molds can't
  // trust their output to stay the same.
  if (meta.isDomImmutable && meta.compiled) {
    if (element.tagName !== 'TEMPLATE') return;
  }

  // Clean up text nodes.
  utils.pruneTextNodes(element);

  if (!meta.vm && !meta.view) {
    let VM = registeredComponents[element.tagName.toLowerCase()];
    if (VM) {
      meta.markDynamic();
      meta.VM = VM;
      meta.view = new View(VM);
      // view should take care of transclusion
      meta.view.tryToCompile(element);
      return;
    }
  }

  // If the element is a template, here we intentionally do not compile its
  // `.content` in order to give it a chance to modify its "raw" state. This is
  // useful for molds that e.g. compile markdown or highlight code.
  for (let i = 0, ii = element.childNodes.length; i < ii; ++i) {
    let child = element.childNodes[i];
    if (child instanceof Element) {
      let oldChild = <Element>child;
      let sibling = child.nextSibling;

      child = <Element>unpackTemplatesFromMolds(<Element>child);
      if (child !== oldChild) element.insertBefore(child, sibling);

      if ((<Element>child).tagName === 'TEMPLATE') {
        utils.shimTemplateContent(<Element>child);
        compileMoldsOnTemplate(<Element>child);
      } else {
        compileAttributeInterpolationsOnElement(<Element>child);
        let meta = Meta.getMeta(child);
        compileAttributeBindingsOnRealElement(<Element>child, <Element>meta.real);
      }
    }
    compileNode(child);
  }
  meta.compiled = true;
}

function unpackTemplatesFromMolds(element: Element): Element {
  let outerElem = element;
  let atCapacity: boolean = element.tagName !== 'TEMPLATE';
  let attributes: Attr[] = [].slice.call(element.attributes);

  // Unpack in reverse order.
  for (let i = attributes.length - 1; i >= 0; --i) {
    let attr = attributes[i];
    if (utils.looksLikeCustomAttribute(attr.name)) {
      let partialName = utils.customAttributeName(attr.name);
      if (registeredMolds[partialName]) {
        if (!atCapacity) {
          atCapacity = true;
          continue;
        }
        let template = <TemplateElement>document.createElement('template');
        utils.shimTemplateContent(template);
        template.setAttribute(attr.name, attr.value);
        element.removeAttribute(attr.name);
        let container = template.content;
        container.appendChild(outerElem);
        outerElem = template;
      }
    }
  }
  return outerElem;
}

function compileMoldsOnTemplate(template: Element): void {
  let meta = Meta.getOrAddMeta(template);
  if (meta.compiled) return;

  for (let i = 0, ii = template.attributes.length; i < ii; ++i) {
    let attr = template.attributes[i];

    // A template is not allowed to have interpolated attributes.
    utils.assert(!hasInterpolation(attr.value), `unexpected interpolation on template:`, template);

    // A template is allowed to have only one mold and no custom attributes.
    if (utils.looksLikeCustomAttribute(attr.name)) {
      let partialName = utils.customAttributeName(attr.name);

      // Make sure it's registered.
      let VM = registeredAttributes[partialName];
      utils.assert(!!VM, `no registered attribute found for '${attr.name}' on template:`, template);
      utils.assert(registeredMolds[partialName], `unexpected non-mold '${attr.name}' on template:`, template);

      // No more than one.
      utils.assert(!meta.moldBinding, `unexpected second mold '${attr.name}' on template:`, template);

      // Register binding.
      meta.markDynamic();
      meta.moldBinding = new AttributeBinding(attr, VM);
    }
  }
}

export function compileAttributeBindingsOnRealElement(virtual: Element, real: Element): void {
  let meta = Meta.getOrAddMeta(virtual);
  // Use the presence of the bindings list as an indicator.
  if (meta.attributeBindings) return;
  meta.attributeBindings = [];

  for (let i = 0, ii = real.attributes.length; i < ii; ++i) {
    let attr = real.attributes[i];
    if (utils.looksLikeCustomAttribute(attr.name)) {
      let partialName = utils.customAttributeName(attr.name);

      // Make sure it's registered and not a mold.
      let VM = registeredAttributes[partialName];
      utils.assert(!!VM, `no registered custom attribute found for '${attr.name}' on element:`, real);
      utils.assert(!registeredMolds[partialName], `unexpected mold '${attr.name}' on element:`, real);

      // Register binding.
      if (!meta.dynamic) meta.markDynamic();
      meta.attributeBindings.push(new AttributeBinding(attr, VM));
    }
  }
}

function compileAttributeInterpolationsOnElement(element: Element): void {
  let meta = Meta.getOrAddMeta(element);
  if (meta.compiled) return;

  for (let i = 0, ii = element.attributes.length; i < ii; ++i) {
    let attr = element.attributes[i];
    if (utils.looksLikeCustomAttribute(attr.name)) continue;
    if (hasInterpolation(attr.textContent)) {
      if (!meta.attributeInterpolations) meta.attributeInterpolations = [];
      if (!meta.dynamic) meta.markDynamic();
      meta.attributeInterpolations.push(new AttributeInterpolation(attr));
    }
  }
}
