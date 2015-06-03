import {registeredComponents, registeredAttributes, registeredMolds} from './boot';
import {hasState, getState, getOrAddState} from './tree';
import {AttributeBinding, AttributeInterpolation, hasInterpolation, compileExpression, compileTextExpression} from './bindings';
import {View} from './view';
import * as utils from './utils';

export function compileNode(node: Node): void {
  let state = getOrAddState(node);
  if (state.isDomImmutable && state.compiled) return;

  if (node instanceof Text) {
    if (hasInterpolation(node.textContent)) {
      state.textInterpolation = compileTextExpression(node.textContent);
    }
    state.compiled = true;
    return;
  }

  if (node instanceof Element) {
    // Patch for an IE11 bug where it splits some text nodes when a
    // MutationObserver is enabled somewhere.
    utils.mergeAdjacentTextNodes(node);

    if (!state.vm && !state.view) {
      let VM = registeredComponents[node.tagName.toLowerCase()];
      if (VM) {
        state.VM = VM;
        state.view = new View(VM);
        // view should take care of transclusion
        state.view.tryToCompile(node);
        return;
      }
    }

    for (let i = 0, ii = node.childNodes.length; i < ii; ++i) {
      let child = node.childNodes[i];
      if (child instanceof Element) {
        let oldChild = <Element>child;
        let sibling = child.nextSibling;

        child = <Element>unpackTemplatesFromMolds(<Element>child);
        if (child !== oldChild) node.insertBefore(child, sibling);

        if ((<Element>child).tagName === 'TEMPLATE') {
          utils.shimTemplateContent(<Element>child);
          compileMoldsOnTemplate(<Element>child);
        } else {
          compileAttributeInterpolationsOnElement(<Element>child);
        }
      }
      compileNode(child);
    }
  }

  state.compiled = true;
}

export function unpackTemplatesFromMolds(element: Element): Element {
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

export function compileMoldsOnTemplate(template: Element): void {
  if (hasState(template)) return;
  let state = getOrAddState(template);


  for (let i = 0, ii = template.attributes.length; i < ii; ++i) {
    let attr = template.attributes[i];

    // A template is not allowed to have interpolated attributes.
    console.assert(!hasInterpolation(attr.value), `unexpected interpolation on template:`, template);

    // A template is allowed to have only one mold and no custom attributes.
    if (utils.looksLikeCustomAttribute(attr.name)) {
      let partialName = utils.customAttributeName(attr.name);

      // Make sure it's registered.
      let VM = registeredAttributes[partialName];
      console.assert(!!VM, `no registered attribute found for '${attr.name}' on template:`, template);
      console.assert(registeredMolds[partialName], `unexpected non-mold '${attr.name}' on template:`, template);

      // No more than one.
      console.assert(!state.moldBinding, `unexpected second mold '${attr.name}' on template:`, template);

      // Register binding.
      state.moldBinding = new AttributeBinding(attr, VM);
    }
  }
}

export function compileAttributeBindingsOnRealElement(virtual: Element, real: Element): void {
  let state = getOrAddState(virtual);
  // Use the presence of the bindings list as an indicator.
  if (state.attributeBindings) return;
  state.attributeBindings = [];

  for (let i = 0, ii = real.attributes.length; i < ii; ++i) {
    let attr = real.attributes[i];
    if (utils.looksLikeCustomAttribute(attr.name)) {
      let partialName = utils.customAttributeName(attr.name);

      // Make sure it's registered and not a mold.
      let VM = registeredAttributes[partialName];
      console.assert(!!VM, `no registered custom attribute found for '${attr.name}' on element:`, real);
      console.assert(!registeredMolds[partialName], `unexpected mold '${attr.name}' on element:`, real);

      // Register binding.
      state.attributeBindings.push(new AttributeBinding(attr, VM));
    }
  }
}

export function compileAttributeInterpolationsOnElement(element: Element): void {
  if (hasState(element)) return;
  let state = getOrAddState(element);

  for (let i = 0, ii = element.attributes.length; i < ii; ++i) {
    let attr = element.attributes[i];
    if (utils.looksLikeCustomAttribute(attr.name)) continue;
    if (hasInterpolation(attr.textContent)) {
      if (!state.attributeInterpolations) state.attributeInterpolations = [];
      state.attributeInterpolations.push(new AttributeInterpolation(attr));
    }
  }
}
