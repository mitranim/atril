'use strict';

import {compileExpression} from './bindings';
import {Meta} from './tree';
import * as utils from './utils';

export class AttributeBinding {
  attr: Attr;
  VM: Function;
  vm: AttributeCtrl;

  constructor(attr: Attr, VM: Function) {
    this.attr = attr;
    this.VM = VM;
  }

  refreshAndPhase(element: Element, meta: Meta): boolean {
    this.refreshState(element, meta);
    return this.phase();
  }

  refreshState(element: Element, meta: Meta): void {
    if (!this.isNew) return;
    let attr = this.attr;
    this.vm = utils.instantiate(this.VM, {
      attribute: attr,
      element: element,
      get expression() {return compileExpression(attr.value)},
      get scope() {return meta.getScope()},
      get hint() {return attr.name.match(/^[a-z-]+\.(.*)/)[1]},
      vm: meta.vm
    });
  }

  // The return value indicates if the attribute was phased. Used to decide if
  // the mold output needs to be recompiled and/or re-rendered.
  phase(): boolean {
    if (typeof this.vm.onPhase === 'function') {
      return this.vm.onPhase(), true;
    }
    return false;
  }

  destroy(): void {
    utils.assert(!!this.vm, `unexpected destroy() call on binding without vm:`, this);
    if (typeof this.vm.onDestroy === 'function') {
      this.vm.onDestroy();
    }
    this.vm = null;
  }

  get isNew(): boolean {return !this.vm}
}

export class AttributeInterpolation {
  attr: Attr;
  expression: TextExpression;
  constructor(attr: Attr) {
    this.attr = attr;
    this.expression = compileInterpolation(attr.value);
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
    // Prevent `with` from throwing an error when `scope` and/or `locals` have
    // no properties.
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
      if (typeof item === 'string') total += item;
      else {
        let result = (<Expression>item).call(this, scope);
        if (result != null) total += result;
      }
    }
    return total;
  };
}
