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

const registeredComponents: {[tagName: string]: ComponentClass} = Object.create(null);
const registeredAttributes: {[attributeName: string]: Function} = Object.create(null);
const registeredDrafts: {[attributeName: string]: boolean} = Object.create(null);

const stateKey = typeof Symbol === 'function' ? Symbol('atrilState') : utils.randomString();
const roots: Root[] = [];

class Root {
  virtual: Element;
  real: Element;
}

export function bootstrap(): void {
  localZone.run(function bootstrap(element: Element = document.body): void {
    let VM = registeredComponents[element.tagName.toLowerCase()];
    if (VM) {
      let root = new Root();
      root.virtual = document.createElement(element.tagName);
      root.real = element;
      // This is where we'll need to pass additional descendants when
      // implementing transclusion. Skipping that for now.
      compileNode(root.virtual);
      let state = getState(root.virtual);
      state.container.phase(root.virtual, root.real);
      roots.push(root);
      return;
    }

    for (let i = 0, ii = element.childNodes.length; i < ii; ++i) {
      let node = element.childNodes[i];
      if (node instanceof Element) bootstrap(node);
    }
  });
}

export function Component(config: ComponentConfig) {
  let tagRegex = /^[a-z][a-z-]*[a-z]$/;

  // Type checks.
  console.assert(typeof config.tagName === 'string', `expected a string tagname, got:`, config.tagName);
  console.assert(tagRegex.test(config.tagName), `the tagname must match regex ${tagRegex}, got:`, config.tagName);

  return function(VM: ComponentClass) {
    console.assert(typeof VM === 'function', `expected a component class, got:`, VM);
    console.assert(!registeredComponents[config.tagName],
                 `unexpected redefinition of component with tagname ${config.tagName}`);
    registeredComponents[config.tagName] = VM;
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

function reflowWithUnlimitedStack(): void {
  for (let i = 0, ii = roots.length; i < ii; ++i) {
    let root = roots[i];
    if (!root.real.parentNode) {
      // ToDo run a destroy phase here, for memory cleanup etc.
      destroy(root.virtual, root.real);
      delete root.virtual;
      delete root.real;
      roots.splice(i, 1);
      continue;
    }
    getState(root.virtual).container.phase(root.virtual, root.real);
  }
}

function destroy(virtual: Element, real: Element): void {
  let state = getState(virtual);
  if (state) for (let key in state) delete state[key];
  delete virtual[stateKey];
}

class ComponentContainer {
  vm: ComponentVM;
  VM: ComponentClass;

  // For async templating.
  compiled: boolean = false;
  loadingTemplate: boolean = false;

  constructor(virtual: Element, VM: ComponentClass) {
    this.VM = VM;
    this.vm = Object.create(VM.prototype);

    // Preassignment.
    getOrAddState(virtual).container = this;

    // Instantiate the viewmodel.
    VM.call(this.vm);

    // Prepare the virtual DOM.
    this.tryToCompile(virtual);
  }

  tryToCompile(virtual: Element): boolean {
    if (this.loadingTemplate) return;

    let template: any = this.VM.template;

    if (typeof template === 'string') {
      this.compileTemplate(template, virtual);
      return;
    }

    let url: any = this.VM.templateUrl;
    if (typeof url === 'string' && url) {
      let template = this.getTemplateFromUrl(url, virtual);
      if (typeof template === 'string') this.compileTemplate(template, virtual);
      return;
    }

    this.compileTemplate('', virtual);
  }

  compileTemplate(template: string, virtual: Element): void {
    this.loadingTemplate = false;
    this.compiled = true;
    virtual.innerHTML = template;
    compileNode(virtual);
  }

  loadTemplateFromPromise(promise: Promise, virtual: Element): void {
    this.loadingTemplate = true;
    promise
      .then((result: any) => {
        this.loadingTemplate = false;
        if (typeof result === 'string') {
          this.compileTemplate(result, virtual);
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

  getTemplateFromUrl(url: string, virtual: Element): string|void {
    let template = utils.templateCache.get(url);
    if (template) return template;
    this.loadTemplateFromPromise(utils.templateCache.load(url), virtual);
  }

  phase(virtual: Element, real: Element) {
    if (!this.compiled) this.tryToCompile(virtual);
    if (this.compiled) {
      this.phaseSync(virtual, real);
      this.vm.element = real;
      if (typeof this.vm.onPhase === 'function') this.vm.onPhase();
    }
  }

  phaseSync(virtual: Node, real: Node): void {
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
        let state = getState(virtualChild);

        // Try to reuse a child or create a new one.
        if (!realChild || state.realNode !== realChild) {
          if (!state.realNode) {
            state.realNode = virtualChild.cloneNode();
          }
          real.insertBefore(state.realNode, realChild);
          realChild = state.realNode;
        }

        if (virtualChild instanceof Element && realChild instanceof Element) {
          compileAttributeBindingsOnRealElement(virtualChild, realChild);
          // Phase custom attributes on both children.
          this.phaseCustomAttributes(virtualChild, realChild);
          // Phase and sync static attributes.
          this.phaseAndSyncAttributeInterpolations(virtualChild, realChild);
          // Phase and sync contents. If the real child is a custom element
          // managed by atril, let it phase itself.
          if (state.container) state.container.phase(virtualChild, realChild);
          else this.phaseSync(virtualChild, realChild);
        } else {
          this.phaseSync(virtualChild, realChild);
        }
      }
      // Remove any leftovers.
      while (real.childNodes.length > children.length) {
        real.removeChild(real.lastChild);
      }
    }
  }

  phaseTextNodes(virtual: Text, real: Text): void {
    let state = getState(virtual);
    if (state.textInterpolation) {
      let scope = getScope(virtual);
      let result = state.textInterpolation.call(scope, scope);
      if (virtual.textContent !== result) virtual.textContent = result;
      if (real.textContent !== result) real.textContent = result;
    }
  }

  phaseTemplate(template: Element): void {
    let state = getState(template);
    let binding = state.moldBinding;
    binding.refreshState(template, state, getScope(template));
    binding.phase();
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
    let state = getState(virtual);
    let bindings = state.attributeBindings;
    if (!bindings) return;

    for (let i = 0, ii = bindings.length; i < ii; ++i) {
      let binding = bindings[i];
      binding.refreshState(real, state, getScope(virtual));
      binding.phase();
    }
  }

  phaseAndSyncAttributeInterpolations(virtual: Element, real: Element): void {
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
}

function compileNode(node: Node): void {
  let state = getOrAddState(node);

  if (node instanceof Text) {
    if (hasInterpolation(node.textContent)) {
      state.textInterpolation = compileTextExpression(node.textContent);
    }
    return;
  }

  if (node instanceof Element) {
    // Patch for an IE11 bug where it splits some text nodes when a
    // MutationObserver is enabled somewhere.
    utils.mergeAdjacentTextNodes(node);

    if (!state.container) {
      let VM = registeredComponents[node.tagName.toLowerCase()];
      if (VM) {
        state.container = new ComponentContainer(node, VM);
        return;
      }
    }

    for (let i = 0, ii = node.childNodes.length; i < ii; ++i) {
      let child = node.childNodes[i];

      if (child instanceof Element) {
        let childElem = <Element>child;
        let sibling = childElem.nextSibling;

        childElem = unpackTemplatesFromDrafts(childElem);
        if (childElem !== child) node.insertBefore(childElem, sibling);

        if (childElem.tagName === 'TEMPLATE') {
          utils.shimTemplateContent(childElem);
          compileDraftsOnTemplate(childElem);
        } else {
          compileAttributeInterpolationsOnElement(childElem);
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
  if (hasState(template)) return;
  let state = getOrAddState(template);

  for (let i = 0, ii = template.attributes.length; i < ii; ++i) {
    let attr = template.attributes[i];

    // A template is not allowed to have interpolated attributes.
    console.assert(!hasInterpolation(attr.value), `unexpected interpolation on template:`, template);

    // A template is allowed to have only one draft and no custom attributes.
    if (utils.looksLikeCustomAttribute(attr.name)) {
      let partialName = utils.customAttributeName(attr.name);

      // Make sure it's registered.
      let VM = registeredAttributes[partialName];
      console.assert(!!VM, `no registered attribute found for '${attr.name}' on template:`, template);
      console.assert(registeredDrafts[partialName], `unexpected non-draft '${attr.name}' on template:`, template);

      // No more than one.
      console.assert(!state.moldBinding, `unexpected second draft '${attr.name}' on template:`, template);

      // Register binding.
      state.moldBinding = new AttributeBinding(attr, VM);
    }
  }
}

function compileAttributeBindingsOnRealElement(virtual: Element, real: Element): void {
  let state = getOrAddState(virtual);
  // Use the presence of the bindings list as an indicator.
  if (state.attributeBindings) return;
  state.attributeBindings = [];

  for (let i = 0, ii = real.attributes.length; i < ii; ++i) {
    let attr = real.attributes[i];
    if (utils.looksLikeCustomAttribute(attr.name)) {
      let partialName = utils.customAttributeName(attr.name);

      // Make sure it's registered and not a draft.
      let VM = registeredAttributes[partialName];
      console.assert(!!VM, `no registered custom attribute found for '${attr.name}' on element:`, real);
      console.assert(!registeredDrafts[partialName], `unexpected draft '${attr.name}' on element:`, real);

      // Register binding.
      state.attributeBindings.push(new AttributeBinding(attr, VM));
    }
  }
}

function compileAttributeInterpolationsOnElement(element: Element): void {
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

function hasInterpolation(text: string): boolean {
  return /\{\{((?:[^}]|}(?=[^}]))*)\}\}/g.test(text);
}

export function compileTextExpression(text: string): TextExpression {
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

function hasState(node: Node): boolean {
  return node.hasOwnProperty(stateKey);
}

function getState(node: Node): State {
  if (hasState(node)) return node[stateKey];
  return null;
}

export function getOrAddState(node: Node): State {
  if (hasState(node)) return node[stateKey];
  node[stateKey] = new State();
  return node[stateKey];
}

class State {
  realNode: Node = null;
  scope: any = null;
  container: ComponentContainer = null;

  textInterpolation: TextExpression = null;
  attributeInterpolations: AttributeInterpolation[] = null;
  attributeBindings: AttributeBinding[] = null;
  moldBinding: AttributeBinding = null;
}

class AttributeInterpolation {
  name: string;
  value: string;
  expression: TextExpression;
  constructor(attr: Attr) {
    this.name = attr.name;
    this.value = attr.value;
    this.expression = compileTextExpression(attr.textContent);
  }
}

class AttributeBinding {
  name: string;
  value: string;
  hint: string;
  expression: Expression;
  VM: Function;
  vm: AttributeCtrl;

  constructor(attr: Attr, VM: Function) {
    this.name = attr.name;
    this.value = attr.value;
    this.hint = attr.name.match(/^[a-z-]+\.(.*)/)[1];
    this.expression = compileExpression(attr.value);
    this.VM = VM;
  }

  refreshState(element: Element, state: State, scope: any): void {
    let isNew = !this.vm;
    if (isNew) {
      this.vm = Object.create(this.VM.prototype);
      this.vm.hint = this.hint;
      this.vm.expression = this.expression;
    }
    this.vm.element = element;
    this.vm.scope = scope;
    this.vm.component = state.container ? state.container.vm : null;
    if (isNew) this.VM.call(this.vm);
  }

  phase(): void {
    if (typeof this.vm.onPhase === 'function') this.vm.onPhase();
  }
}

// messy, fix
function getScope(virtual: Node): any {
  let state = getState(virtual);
  if (state.scope) return state.scope;
  if (virtual.parentNode) {
    let parentState = getState(virtual.parentNode);
    if (parentState.container) return parentState.container.vm;
    return getScope(virtual.parentNode);
  }
  if (state.container) return state.container.vm;
  return null;
}
