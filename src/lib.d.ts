/*--------------------------------- Modules ---------------------------------*/

declare module 'zone.js' {
  var x;
  export default x;
}

declare var zone: any;

/*-------------------------------- Built-ins --------------------------------*/

declare var Symbol: Function;

interface Element {
  innerHTML: string;
  cloneNode(): Element;
}

interface TemplateElement extends Element {
  content?: DocumentFragment;
}

interface Promise {
  then: (callback: Function) => any;
  catch: (callback: Function) => any;
}

interface Object {
  hasOwnProperty(key: symbol): boolean;
  hasOwnProperty(key: symbol|string): boolean;
}

declare var Promise: {
  prototype: Promise;
  new(callback: Function): Promise;
  resolve(value?: any): Promise;
  reject(reason?: any): Promise;
};

/*---------------------------------- Local ----------------------------------*/

interface ComponentConfig {
  tagName: string;
}

interface AssignableClass extends Function {
  assign?: {[propertyName: string]: string};
}

interface ComponentClass extends AssignableClass {
  view?: string|Function;
  viewUrl?: string|Function;
  bindable?: string[];
}

interface ComponentVM {
  element?: Element;
  onPhase?(): void;
  onDestroy?(): void;
}

interface AttributeConfig {
  attributeName: string;
}

interface AttributeClass extends AssignableClass {}

interface AttributeCtrl {
  element?: Element;
  hint?: string;
  expression?: Expression;
  scope?: any;
  vm?: any;
  onPhase?(): void;
  onDestroy?(): void;
}

interface Expression {
  (scope: any, locals?: any): any;
}

interface TextExpression {
  (scope: any): string;
}

interface ArrayLike {
  [index: number]: any;
  length: number;
}
