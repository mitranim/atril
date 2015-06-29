declare module 'views' {
  var x: {[path: string]: string};
  export default x;
}

declare module 'atril' {
  export function Component(config: {tagName: string}): any;
  export function Attribute(config: {attributeName: string}): any;
  export function Mold(config: {attributeName: string}): any;
  export function bootstrap(): void;
  export function bindable(target: any, propertyName: string): void;
  export function assign(targetOrKey: any, propertyNameOrNothing?: string): any;
  export const viewCache: {
    get(url: string): string|void;
    set(url: string, view: string): void;
    load(url: string): Promise;
  };
  export var Meta: any;
  export function compileExpression(expression: string): Function;
}

declare module 'highlightjs' {
  import x = require('highlight.js');
  export default x;
}

declare module 'marked' {
  var x: any;
  export default x;
}

interface Promise {
  then: (callback: Function) => any;
  catch: (callback: Function) => any;
}

declare var Promise: {
  prototype: Promise;
  new(callback: Function): Promise;
  resolve(value?: any): Promise;
  reject(reason?: any): Promise;
};

interface HTMLTemplateElement extends HTMLElement {
  content?: DocumentFragment;
}
