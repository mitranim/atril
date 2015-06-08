'use strict';

import {Trace} from './tree';

export class AttributeBinding {
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

  refreshState(element: Element, trace: Trace): void {
    let isNew = this.isNew;
    if (isNew) {
      this.vm = Object.create(this.VM.prototype);
      this.vm.hint = this.hint;
      this.vm.expression = this.expression;
      this.vm.element = element;
      this.vm.component = trace.vm || null;
    }
    let scope = trace.getScope();
    if (this.vm.scope !== scope) this.vm.scope = scope;
    if (isNew) this.VM.call(this.vm);
  }

  // Indicates if the attribute was phased. Used to decide if the mold output
  // needs to be recompiled and/or re-rendered.
  phase(): boolean {
    if (typeof this.vm.onPhase === 'function') {
      return this.vm.onPhase(), true;
    }
    return false;
  }

  destroy(): void {
    if (typeof this.vm.onDestroy === 'function') {
      this.vm.onDestroy();
    }
  }

  get isNew(): boolean {return !this.vm}
}

export class AttributeInterpolation {
  attr: Attr;
  expression: TextExpression;
  constructor(attr: Attr) {
    this.attr = attr;
    this.expression = compileInterpolation(attr.textContent);
  }
}

// Problem: provides access to globals.
export function compileExpression(expression: string): Expression {
  if (!expression) return () => undefined;

  let returnPrefix = ~expression.indexOf(';') ? '' : 'return ';
  let body = `with (arguments[0]) with (arguments[1]) {
    return function() {'use strict';
      ${returnPrefix}${expression}
    }.call(this);
  }`;
  let func = new Function(body);

  return function(scope: any, locals?: any): any {
    // Prevent `with` from throwing an error when the scope or the locals are
    // empty.
    if (scope == null) scope = Object.create(null);
    if (locals == null) locals = Object.create(null);

    return func.call(this === window ? scope : this, scope, locals);
  };
}

export function hasInterpolation(text: string): boolean {
  return /\{\{((?:[^}]|}(?=[^}]))*)\}\}/g.test(text);
}

export function compileInterpolation(text: string): TextExpression {
  if (!text) return () => '';

  let reg = /\{\{((?:[^}]|}(?=[^}]))*)\}\}/g;
  let result: RegExpExecArray;
  let collection: (string|Expression)[] = [];
  let lastIndex: number = 0;

  while (result = reg.exec(text)) {
    let slice = text.slice(lastIndex, result.index);
    if (slice) collection.push(slice);
    lastIndex = result.index + result[0].length;
    collection.push(compileExpression(result[1]));
  }
  let slice = text.slice(lastIndex);
  if (slice) collection.push(slice);

  return function(scope: any): string {
    let total = '';
    for (let item of collection) {
      total += typeof item === 'string' ? item : (<Expression>item).call(this, scope);
    }
    return total;
  };
}
