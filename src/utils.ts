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
 * Normalises a string, converting everything except symbols valid in
 * JavaScript identifiers and dots into singular spaces and joining them via
 * camelcase.
 */
export function normalise(name: string): string {
  name = name.replace(/[^$_A-Za-z0-9.]+/g, ' ');

  return name.split(/\s+/g).map((chunk: string, index) => {
    if (!index) return chunk;
    return chunk[0].toUpperCase() + chunk.slice(1);
  }).join('');
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
  // NaN is the only value that doesn't equal itself.
  // For our purposes, NaN === NaN -> true.
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

// For browsers like IE that don't natively support `.content` on <template>
// elements.
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

// 1. Empty text nodes are sometimes treated as missing by browsers, tripping
//    up our mechanisms that depend on child count and order, like `for.`.
// 2. In IE11, when a MutationObserver is enabled _anywhere_ in the document,
//    the browser sometimes splits text nodes, tripping up interpolation.
export function pruneTextNodes(node: Node): void {
  let isPre = false;
  let current = node;
  do {
    if (isPre = (current instanceof HTMLPreElement)) break;
  } while (current = current.parentElement);

  for (let i = node.childNodes.length - 1; i >= 0; --i) {
    let child = node.childNodes[i];
    if (child instanceof Text) {
      // Keep whitespace in a `<pre>` and remove anywhere else.
      if (!isPre && /^\s*$/.test(child.textContent)) {
        node.removeChild(child);
        continue;
      }
      // Merge adjacent text nodes.
      let sibling = node.childNodes[i+1];
      if (sibling instanceof Text) {
        child.textContent += sibling.textContent;
        node.removeChild(sibling);
      }
    }
  }
  if (node instanceof Element && node.tagName === 'TEMPLATE') {
    pruneTextNodes((<TemplateElement>node).content);
  }
}

export function isValidIdentifier(expression: string): boolean {
  return /^[$_A-Za-z]+[$_A-Za-z0-9]*$/.test(expression);
}

export function isValidKebabIdentifier(expression: string): boolean {
  return /^[$_a-z]+[$_a-z0-9-]*$/.test(expression);
}

// match[1] -> identifier
// match[2] -> everything else
export function matchValidIdentifier(expression: string) {
  return expression.match(/^([$_A-Za-z]+[$_A-Za-z0-9]*)(.*)/);
}

// match[1] -> identifier
// match[2] -> everything else
export function matchValidKebabIdentifier(expression: string) {
  return expression.match(/^([$_a-z]+[$_a-z0-9-]*)(.*)/);
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

// Can be sync or async. No guarantees. We really want to be sync when possible
// in order to pause the UI thread.
export function onload(callback: Function): void {
  if (document.readyState === 'loaded' ||
      document.readyState === 'complete' ||
      document.readyState === 'interactive') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', function cb() {
      document.removeEventListener('DOMContentLoaded', cb);
      callback();
    });
  }
}

// User agent sniffing. You're welcome to detecting the "capability" to randomly
// erase custom properties of Text nodes.
export const msie = !!(<any>document).documentMode;

// FF has a tendency to reverse attribute order when parsing HTML into DOM.
let testDiv = document.createElement('div');
testDiv.innerHTML = '<template one two></template>';
let attrs = testDiv.childNodes[0].attributes;
let reversesAttributes: boolean = false;
if (attrs[0].name === 'two') reversesAttributes = true;
export const browserReversesAttributes = reversesAttributes;
