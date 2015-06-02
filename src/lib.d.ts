/*--------------------------------- Modules ---------------------------------*/

declare module 'zone' {
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

interface ComponentClass extends Function {
  template?: string|Function;
  templateUrl?: string|Function;
  bindable?: string[];
}

interface ComponentVM {
  element: Element;
  onPhase?(): void;
}

interface AttributeConfig {
  attributeName: string;
}

interface AttributeCtrl {
  element: Element;
  hint: string;
  expression: Expression;
  scope: any;
  component: any;
  onPhase?(): void;
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
