'use strict';
'Thou shalt not comment.';

import * as utils from './utils';
import 'zone';

let localZone = zone.fork({
  afterTask: function() {
    // zone.js automatically reruns a task after ≈1 s if the task throws. It
    // also hides all exceptions after the first during these retries. For us,
    // if a binding consistently throws during a phase, it causes continuous
    // reflows. To avoid that, we have to capture the exception.
    try {reflow()}
    catch (err) {console.error(err)}
  }
});

export function bootstrap(): void {
  localZone.run(() => {});
}

// Viewmodel of the given element.
export const vmKey = typeof Symbol === 'function' ? Symbol('atrilVm') : utils.randomString();
// Component container on the given element or text interpolation on the given node.
const bindingKey = typeof Symbol === 'function' ? Symbol('atrilBinding') : utils.randomString();
// Collection of an element's attribute bindings keyed by attribute names.
const bindingStashKey = typeof Symbol === 'function' ? Symbol('atrilBindingStash') : utils.randomString();
// Local scope inheriting from a viewmodel, forked at the given element.
export const scopeKey = typeof Symbol === 'function' ? Symbol('atrilScope') : utils.randomString();

const registeredComponents: {[tagName: string]: ComponentClass} = Object.create(null);
const registeredAttributes: {[attributeName: string]: Function} = Object.create(null);
const registeredDrafts: {[attributeName: string]: boolean} = Object.create(null);

export function Component(config: ComponentConfig) {
  let tagRegex = /^[a-z][a-z-]*[a-z]$/;

  // Type checks.
  console.assert(typeof config.tagName === 'string', `expected a string tagname, got:`, config.tagName);
  console.assert(tagRegex.test(config.tagName), `the tagname must match regex ${tagRegex}, got:`, config.tagName);

  return function(VM: ComponentClass) {
    console.assert(typeof VM === 'function', `expected a component class, got:`, VM);
    let name = config.tagName.toUpperCase();
    console.assert(!registeredComponents[name],
                 `unexpected redefinition of component with tagname ${config.tagName}`);
    registeredComponents[name] = VM;
  };
}

export function Attribute(config: AttributeConfig) {
  let nameRegex = /^[a-z][a-z-]*[a-z]$/;

  // Type checks.
  console.assert(typeof config.attributeName === 'string',
                 `expected a string attribute name, got:`, config.attributeName);
  console.assert(nameRegex.test(config.attributeName),
                 `the attribute name must match regex ${nameRegex}, got:`, config.attributeName);
  console.assert(!registeredAttributes[config.attributeName],
                 `unexpected redefinition of attribute ${config.attributeName}`);

  return function(VM: Function) {
    console.assert(typeof VM === 'function', `expected an attribute class, got:`, VM);
    registeredAttributes[config.attributeName] = VM;
  };
}

export function Draft(config: AttributeConfig) {
  return function(VM: Function) {
    Attribute(config)(VM);
    registeredDrafts[config.attributeName] = true;
  };
}

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

function reflowWithUnlimitedStack(element: Element = document.body): void {
  console.assert(element instanceof Element, `expected an Element, got:`, element);

  let container = <ComponentContainer>element[bindingKey];
  if (container) {
    container.phase();
    return;
  }

  let VM = registeredComponents[element.tagName];
  if (VM) {
    let container = new ComponentContainer(element, VM);
    container.instantiate();
    container.phase();
    return;
  }

  for (let i = 0, ii = element.childNodes.length; i < ii; ++i) {
    let node = element.childNodes[i];
    if (node instanceof Element) reflowWithUnlimitedStack(node);
  }
}

function instantiateIfNecessary(element: Element): void {
  if (element[bindingKey]) return;
  let VM = registeredComponents[element.tagName];
  if (VM) new ComponentContainer(element, VM).instantiate();
}

class ComponentContainer {
  virtual: Element;
  real: Element;
  vm: ComponentInstance;
  VM: ComponentClass;

  // For async templating.
  compiled: boolean = false;
  loadingTemplate: boolean = false;

  constructor(element: Element, VM: ComponentClass) {
    this.real = element;
    this.VM = VM;
  }

  instantiate(): void {
    this.vm = Object.create(this.VM.prototype);

    // Preassignment.
    this.real[vmKey] = this.vm;
    this.vm.element = this.real;
    this.real[bindingKey] = this;

    // Instantiate the viewmodel.
    this.VM.call(this.vm);

    // Prepare the virtual DOM.
    this.tryToCompile();
  }

  tryToCompile(): boolean {
    if (this.loadingTemplate) return;

    let template: any = this.VM.template;

    if (typeof template === 'string') {
      this.compileTemplate(template);
      return;
    }

    let url: any = this.VM.templateUrl;
    if (typeof url === 'string' && url) {
      let template = this.getTemplateFromUrl(url);
      if (typeof template === 'string') this.compileTemplate(template);
      return;
    }

    this.compileTemplate('');
  }

  compileTemplate(template: string): void {
    this.loadingTemplate = false;
    this.compiled = true;
    this.virtual = this.real.cloneNode();
    this.virtual.innerHTML = template;
    compileNode(this.virtual);
  }

  loadTemplateFromPromise(promise: Promise): void {
    this.loadingTemplate = true;
    promise
      .then((result: any) => {
        this.loadingTemplate = false;
        if (typeof result === 'string') {
          this.compileTemplate(result);
          return;
        }
        console.warn('expected a template promise to resolve to a string, got:', result);
        return Promise.reject(`expected a template promise to resolve to a string, got: ${result}`);
      })
      .catch(err => {
        this.loadingTemplate = false;
        this.phase = () => {};
        return Promise.reject(err);
      });
  }

  getTemplateFromUrl(url: string): string|void {
    let template = utils.templateCache.get(url);
    if (template) return template;
    this.loadTemplateFromPromise(utils.templateCache.load(url));
  }

  phase() {
    if (!this.compiled) this.tryToCompile();
    if (this.compiled) this.phaseSync();
  }

  phaseSync(virtual: Node = this.virtual, real: Node = this.real): void {
    // Sanity check.
    console.assert(nodeTypesMatch(virtual, real), `expected nodes with matching types, got`, virtual, `and`, real);

    if (virtual instanceof Text && real instanceof Text) {
      this.phaseTextNodes(virtual, real);
      return;
    }

    if (virtual instanceof Element) {
      let children: Node[] = [];
      for (let i = 0, ii = virtual.childNodes.length; i < ii; ++i) {
        let child = virtual.childNodes[i];
        if (child instanceof Element && child.tagName === 'TEMPLATE') {
          children.push(...this.phaseAndUnpackTemplate(child));
        } else {
          children.push(child);
        }
      }

      // Compare the children side by side.
      for (var i = 0, ii = children.length; i < ii; ++i) {
        let virtualChild = children[i];
        let realChild = real.childNodes[i];
        // Create a child if there's no similar one in this position.
        if (!realChild || !nodeTypesMatch(virtualChild, realChild)) {
          realChild = virtualChild.cloneNode();
        }
        if (virtualChild instanceof Element && realChild instanceof Element) {
          compileCustomAttributesOnElement(realChild);
          // Phase custom attributes on both children.
          this.phaseCustomAttributes(virtualChild, realChild);
          // Phase and sync static attributes.
          this.phaseAndSyncStaticAttributes(virtualChild, realChild);
          // Phase and sync contents. If the real child is a custom element
          // managed by atril, instantiate and phase it instead.
          instantiateIfNecessary(realChild);
          let container = <ComponentContainer>realChild[bindingKey];
          if (container) container.phase();
          else this.phaseSync(virtualChild, realChild);
        } else {
          this.phaseSync(virtualChild, realChild);
        }
        // Add the element to the DOM if all operations are successful.
        if (real.childNodes[i] !== realChild)  {
          real.insertBefore(realChild, real.childNodes[i] || null);
        }
      }
      // Remove any leftovers.
      while (real.childNodes.length > children.length) {
        real.removeChild(real.lastChild);
      }
    }

    if (real === this.real && typeof this.vm.phase === 'function') this.vm.phase();
  }

  phaseTextNodes(virtual: Text, real: Text): void {
    let expression = virtual[bindingKey];
    if (!expression) return;
    let scope = this.scopeAtVirtualNode(virtual);
    let result = expression(scope);
    if (virtual.textContent !== result) virtual.textContent = result;
    if (real.textContent !== result) real.textContent = result;
  }

  phaseTemplate(template: Element): void {
    for (let i = 0, ii = template.attributes.length; i < ii; ++i) {
      let attr = template.attributes[i];
      // Attributes like `style` can get automatically removed during phasing.
      if (!attr) continue;
      let binding = getBindingForAttribute(template, attr.name);
      if (binding instanceof AttributeBinding) {
        binding.refreshState(template, this.scopeAtVirtualNode(template));
        binding.phase();
      }
    }
  }

  phaseAndUnpackTemplate(template: Element): Node[] {
    this.phaseTemplate(template);
    compileNode(template);
    let nodes: Node[] = [];
    for (let i = 0, ii = template.childNodes.length; i < ii; ++i) {
      let child = template.childNodes[i];
      if (child instanceof Element && child.tagName === 'TEMPLATE') {
        nodes.push(...this.phaseAndUnpackTemplate(child));
      } else {
        nodes.push(child);
      }
    }
    return nodes;
  }

  phaseCustomAttributes(virtual: Element, real: Element): void {
    for (let i = 0, ii = real.attributes.length; i < ii; ++i) {
      let attr = real.attributes[i];
      // Attributes like `style` can get automatically removed during phasing.
      if (!attr) continue;
      let binding = getBindingForAttribute(real, attr.name);
      if (binding instanceof AttributeBinding) {
        binding.refreshState(real, this.scopeAtVirtualNode(virtual));
        binding.phase();
      }
    }
  }

  phaseAndSyncStaticAttributes(virtual: Element, real: Element): void {
    for (let i = 0, ii = virtual.attributes.length; i < ii; ++i) {
      let attr = virtual.attributes[i];
      // Ignore custom attributes.
      if (utils.looksLikeCustomAttribute(attr.name)) continue;
      // Sync static attributes.
      let expression = getBindingForAttribute(virtual, attr.name);
      if (expression instanceof Function) {
        let scope = this.scopeAtVirtualNode(virtual);
        let result = expression.call(scope, scope);
        attr.textContent = result;
        let realAttr = real.attributes.getNamedItem(attr.name);
        if (realAttr) realAttr.textContent = result;
        else real.setAttribute(attr.name, result);
      }
    }
    // We don't remove extraneous real attributes because this would mess with
    // bindings to `style`, `hidden`, etc.
  }

  scopeAtVirtualNode(node: Text|Element): any {
    while (true) { // playing with fire
      if (node[scopeKey]) return node[scopeKey];
      if (node === this.virtual) return this.vm;
      node = node.parentElement;
    }
  }
}

class AttributeBinding {
  hint: string;
  expression: Expression;
  VM: Function;
  vm: AttributeInstance;

  constructor(attribute: Attr, VM: Function) {
    this.hint = attribute.name.match(/^[a-z-]+\.(.*)/)[1];
    this.expression = compileExpression(attribute.value);
    this.VM = VM;
  }

  refreshState(element: Element, scope: any): void {
    let isNew = !this.vm;
    if (isNew) {
      this.vm = Object.create(this.VM.prototype);
      this.vm.hint = this.hint;
      this.vm.expression = this.expression;
    }
    this.vm.element = element;
    this.vm.scope = scope;
    if (isNew) this.VM.call(this.vm);
  }

  phase(): void {
    if (typeof this.vm.phase === 'function') this.vm.phase();
  }
}

function nodeTypesMatch(one: Node, other: Node): boolean {
  return one instanceof Comment && other instanceof Comment ||
         one instanceof Text && other instanceof Text ||
         (one instanceof Element && other instanceof Element &&
          one.tagName === other.tagName);
}

function hasInterpolation(text: string): boolean {
  return /\{\{((?:[^}]|}(?=[^}]))*)\}\}/g.test(text);
}

function compileTextExpression(text: string): TextExpression {
  let reg = /\{\{((?:[^}]|}(?=[^}]))*)\}\}/g;
  let result: RegExpExecArray;
  let collection: (string|Expression)[] = [];
  let slice = text;

  while (result = reg.exec(slice)) {
    let piece = slice.slice(0, result.index);
    if (piece) collection.push(piece);
    slice = slice.slice(result.index).replace(result[0], '');
    collection.push(compileExpression(result[1]));
  }
  if (slice) collection.push(slice);

  return function(scope: any, locals?: any): string {
    if (scope == null) return '';
    let total = '';
    for (let i = 0, ii = collection.length; i < ii; ++i) {
      let item = collection[i];
      if (typeof item === 'string') {
        total += item;
        continue;
      }
      let result = (<Expression>item).call(scope, scope, locals);
      if (result != null) total += result;
    }
    return total;
  };
}

// Problems:
// * Provides access to globals.
// * Doesn't assign to missing properties (throws a reference error).
// * Has to be re-interpreted on each call to support locals that don't mess
//   with property assignment in scopes.
export function compileExpression(expression: string): Expression {
  return function(scope: any, locals?: any) {
    let argList: string[] = [];
    let argValues: any[] = [];
    if (locals != null && typeof locals === 'object') {
      argList = Object.keys(locals);
      for (let i = 0, ii = argList.length; i < ii; ++i) {
        argValues.push(locals[argList[i]]);
      }
    }
    argValues.push(scope);
    let returnPrefix = ~expression.indexOf(';') ? '' : 'return ';
    let body = `with (arguments[${argValues.length - 1}]) {
      return function() {'use strict';
        ${returnPrefix}${expression}
      }.call(this);
    }`;
    argList.push(body);
    let func = Function(...argList);
    return func.call(this === window ? scope : this, ...argValues);
  };
}

function compileNode(node: Node): void {
  if (node instanceof Text) {
    if (!node[bindingKey] && hasInterpolation(node.textContent)) {
      node[bindingKey] = compileTextExpression(node.textContent);
    }
    return;
  }
  if (node instanceof Element) {
    // Patch for an IE11 bug where it splits some text nodes when a
    // MutationObserver is enabled somewhere.
    utils.mergeAdjacentTextNodes(node);

    for (let i = 0, ii = node.childNodes.length; i < ii; ++i) {
      let child = node.childNodes[i];
      if (child instanceof Element) {
        let childElem = <Element>child;
        let sibling = childElem.nextSibling;
        childElem = unpackTemplatesFromDrafts(childElem);
        node.insertBefore(childElem, sibling);
        if (childElem.tagName === 'TEMPLATE') {
          utils.shimTemplateContent(childElem);
          compileDraftsOnTemplate(childElem);
        } else {
          compileTextAttributesOnElement(childElem);
        }
      }
      compileNode(child);
    }
  }
}

function unpackTemplatesFromDrafts(element: Element): Element {
  let outerElem = element;
  let atCapacity: boolean = element.tagName !== 'TEMPLATE';
  let attributes: Attr[] = [].slice.call(element.attributes);

  // Unpack in reverse order.
  for (let i = attributes.length - 1; i >= 0; --i) {
    let attr = attributes[i];
    if (utils.looksLikeCustomAttribute(attr.name)) {
      let partialName = utils.customAttributeName(attr.name);
      if (registeredDrafts[partialName]) {
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

function compileDraftsOnTemplate(template: Element): void {
  let oneDraftAllowed: boolean = true;
  for (let i = 0, ii = template.attributes.length; i < ii; ++i) {
    let attr = template.attributes[i];
    if (getBindingForAttribute(template, attr.name)) continue;

    // A template is not allowed to have interpolated attributes.
    console.assert(!hasInterpolation(attr.value), `unexpected interpolation on template:`, template);

    // A template is allowed to have only one draft and no custom attributes.
    if (utils.looksLikeCustomAttribute(attr.name)) {
      let partialName = utils.customAttributeName(attr.name);

      // Make sure it's registered.
      let VM = registeredAttributes[partialName];
      console.assert(!!VM, `no registered attribute found for '${attr.name}' on template:`, template);
      console.assert(registeredDrafts[partialName],
                     `unexpected non-draft '${attr.name}' on template:`, template);
      console.assert(oneDraftAllowed,
                     `unexpected second draft '${attr.name}' on template:`, template);
      oneDraftAllowed = false;

      // Register binding.
      setBindingForAttribute(template, attr.name, new AttributeBinding(attr, VM));
    }
  }
}

// Must be called on a real element.
function compileCustomAttributesOnElement(element: Element): void {
  for (let i = 0, ii = element.attributes.length; i < ii; ++i) {
    let attr = element.attributes[i];
    let binding = getBindingForAttribute(element, attr.name);
    if (!binding && utils.looksLikeCustomAttribute(attr.name)) {
      let partialName = utils.customAttributeName(attr.name);

      // Make sure it's registered and not a draft.
      let VM = registeredAttributes[partialName];
      console.assert(!!VM, `no registered custom attribute found for '${attr.name}' on element:`, element);
      console.assert(!registeredDrafts[partialName], `unexpected draft '${attr.name}' on element:`, element);

      // Register binding.
      setBindingForAttribute(element, attr.name, new AttributeBinding(attr, VM));
    }
  }
}

function compileTextAttributesOnElement(element: Element): void {
  for (let i = 0, ii = element.attributes.length; i < ii; ++i) {
    let attr = element.attributes[i];
    if (utils.looksLikeCustomAttribute(attr.name)) continue;
    let expression = getBindingForAttribute(element, attr.name);
    if (!expression && hasInterpolation(attr.textContent)) {
      setBindingForAttribute(element, attr.name, compileTextExpression(attr.textContent));
    }
  }
}

function getBindingForAttribute(element: Element, attrName: string): AttributeBinding|Function {
  let stash = element[bindingStashKey];
  if (!stash) return null;
  return stash[attrName] || null;
}

/**
 * Stores an attribute binding in a separate store on the element. Attributes
 * appear to be refreshed at arbitrary points in time due to garbage
 * collection, losing bindings, which we want to preserve over the lifetime of
 * an element. Happens consistently in Blink.
 */
function setBindingForAttribute(element: Element, attrName: string, binding: AttributeBinding|Function): void {
  let stash = element[bindingStashKey];
  if (!stash) {
    stash = Object.create(null);
    element[bindingStashKey] = stash;
  }
  stash[attrName] = binding;
}
