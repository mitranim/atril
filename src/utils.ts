'use strict';

export function bindable(target: any, propertyName: string): void {
  if (!target) return;
  let VM = <ComponentClass>(target.constructor);
  if (!(VM.bindable instanceof Array)) VM.bindable = [];
  if (!~VM.bindable.indexOf(propertyName)) VM.bindable.push(propertyName);
}

export function randomString(): string {
  return (Math.random() * Math.pow(10, 16)).toString(16);
}

/**
 * Normalises a string, converting everything except English letters and dots
 * into singular spaces, inserting spaces into case boundaries, and
 * lowercasing.
 */
function normalise(name: string): string {
  name = name.replace(/[^A-Za-z.]+/g, ' ');

  for (var i = 0; i < name.length - 1; i++) {
    var prefix = name.slice(0, i + 1);
    var next = name[i + 1];

    if (/[a-z]/.test(name[i]) && /[A-Z]/.test(next)) {
      next = next.toLowerCase();
      name = prefix + ' ' + next + name.slice(i + 2);
    }
  }

  return name.trim().toLowerCase();
}

/**
 * Converts an identifier into kebab case.
 */
export function kebabCase(name: string): string {
  return normalise(name).replace(/ /g, '-');
}

/**
 * Converts an identifier into camelcase.
 */
export function camelCase(name: string): string {
  name = normalise(name);
  return name.replace(/ (.)/g, (m, p1: string) => p1.toUpperCase());
}

export function looksLikeCustomAttribute(attributeName: string): boolean {
  return /^[a-z-]+\./.test(attributeName);
}

export function customAttributeName(attributeName: string): string {
  return attributeName.match(/^([a-z-]+)\./)[1];
}

export function isArrayLike(value: any): boolean {
  if (!value) return false;
  return value instanceof Array || typeof value === 'string' ||
         typeof value.length === 'number' && value.length >= 0;
}

export function strictEqual(one: any, other: any): boolean {
  return one === other || typeof one === 'number' && typeof other === 'number';
}

export function cloneDeep(node: Node): Node {
  let clone = node.cloneNode();

  // When cloning a <template> in a supporting browser, or if the template is
  // shimmed, copy nodes from its content fragment to the content fragment of
  // the clone.
  let container: Node = node instanceof Element && node.tagName === 'TEMPLATE' &&
                        (<TemplateElement>node).content || node;
  let clonedContainer: Node = clone instanceof Element && clone.tagName === 'TEMPLATE' &&
                        (<TemplateElement>clone).content || clone;

  for (let i = 0, ii = container.childNodes.length; i < ii; ++i) {
    clonedContainer.appendChild(cloneDeep(container.childNodes[i]));
  }

  return clone;
}

export function shimTemplateContent(template: TemplateElement): void {
  if (!template.content) {
    let fragment = document.createDocumentFragment();
    Object.defineProperty(template, 'content', {
      get: () => fragment,
      set: () => {}
    });
    while (template.hasChildNodes()) {
      fragment.appendChild(template.removeChild(template.firstChild));
    }
  }
}

// Adjacent text nodes happen due to browser bugs, e.g. IE11 splits some text
// nodes if a MutationObserver is enabled somewhere on the page.
export function mergeAdjacentTextNodes(node: Node): void {
  for (let i = node.childNodes.length - 1; i >= 0; --i) {
    let child = node.childNodes[i];
    let sibling = node.childNodes[i+1];
    if (child instanceof Text && sibling instanceof Text) {
      child.textContent += sibling.textContent;
      node.removeChild(sibling);
    }
  }
  if (node instanceof Element && node.tagName === 'TEMPLATE') {
    mergeAdjacentTextNodes((<TemplateElement>node).content);
  }
}

export function isValidIdentifier(expression: string): boolean {
  return /^[$_A-Za-z]+[$_A-Za-z0-9]*$/.test(expression);
}

// match[1] -> identifier
// match[2] -> everything else
export function matchValidIdentifier(expression: string) {
  return expression.match(/^([$_A-Za-z]+[$_A-Za-z0-9]*)(.*)/);
}

// Checks if something looks like `blah(.blah.blah)*`.
// Doesn't support `blah[blah]` or `blah[0]`.
export function isStaticPathAccessor(expression: string): boolean {
  return /^[$_A-Za-z]+[$_A-Za-z0-9]*(?:\.[$_A-Za-z]+[$_A-Za-z0-9]*)*$/.test(expression);
}

let consoleWarnAvailable = typeof console !== 'undefined' && console && typeof console.warn === 'function';
export function warn(msg: string, extra?: any): void {
  if (!consoleWarnAvailable) return;
  // warn.apply doesn't print error stack
  if (arguments.length > 2) console.warn(msg, extra);
  else console.warn(msg);
}

let consoleErrorAvailable = typeof console !== 'undefined' && console && typeof console.error === 'function';
export function error(msg: string, extra?: any): void {
  if (!consoleErrorAvailable) return;
  // error.apply doesn't print error stack
  if (arguments.length > 2) console.error(msg, extra);
  else console.error(msg);
}

// Can't use console.assert because it doesn't interrupt the control flow.
export function assert(ok: boolean, msg: string, extra?: any): void {
  if (ok) return;
  if (consoleErrorAvailable) {
    // error.apply doesn't print error stack
    if (arguments.length > 2) console.error(msg, extra);
    else console.error(msg);
  }
  if (arguments.length > 2) msg += extra;
  throw new Error(msg);
}
