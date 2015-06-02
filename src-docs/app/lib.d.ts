declare module 'atril' {
  export function Component(config: {tagName: string}): any;
  export function Attribute(config: {attributeName: string}): any;
  export function Mold(config: {attributeName: string}): any;
  export function bootstrap(): void;
  export function bindable(target: any, propertyName: string): void;
  export const templateCache: {
    get(url: string): string|void;
    set(url: string, template: string): void;
    load(url: string): Promise;
  };
}

declare module 'highlightjs' {
  import x = require('highlight.js');
  export default x;
}

declare module 'marked' {
  interface Marked {
    (source: string): string;
    setOptions(options: any): void;
  }
  var marked: Marked;
  export default marked;
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
