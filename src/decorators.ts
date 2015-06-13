'use strict';

import * as utils from './utils';

export const registeredComponents: {[tagName: string]: ComponentClass} = Object.create(null);
export const registeredAttributes: {[attributeName: string]: Function} = Object.create(null);
export const registeredMolds: {[attributeName: string]: boolean} = Object.create(null);

export function Component(config: ComponentConfig) {
  let tagRegex = /^[a-z][a-z-]*[a-z]$/;

  // Type checks.
  utils.assert(typeof config.tagName === 'string', `expected a string tagname, got:`, config.tagName);
  utils.assert(tagRegex.test(config.tagName), `the tagname must match regex ${tagRegex}, got:`, config.tagName);

  return function(VM: ComponentClass) {
    utils.assert(typeof VM === 'function', `expected a component class, got:`, VM);
    utils.assert(!registeredComponents[config.tagName],
                 `unexpected redefinition of component with tagname ${config.tagName}`);
    registeredComponents[config.tagName] = VM;
  };
}

export function Attribute(config: AttributeConfig) {
  let nameRegex = /^[a-z][a-z-]*[a-z]$/;

  // Type checks.
  utils.assert(typeof config.attributeName === 'string',
                 `expected a string attribute name, got:`, config.attributeName);
  utils.assert(nameRegex.test(config.attributeName),
                 `the attribute name must match regex ${nameRegex}, got:`, config.attributeName);
  utils.assert(!registeredAttributes[config.attributeName],
                 `unexpected redefinition of attribute ${config.attributeName}`);

  return function(VM: AttributeClass) {
    utils.assert(typeof VM === 'function', `expected an attribute class, got:`, VM);
    registeredAttributes[config.attributeName] = VM;
  };
}

export function Mold(config: AttributeConfig) {
  return function(VM: AttributeClass) {
    Attribute(config)(VM);
    registeredMolds[config.attributeName] = true;
  };
}

// Marks a property as bindable for databinding. Example usage:
//   class X {
//     @bindable myProperty: any;
//   }
export function bindable(target: any, propertyName: string): void {
  if (!target) return;
  let VM = <ComponentClass>(target.constructor);
  if (!(VM.bindable instanceof Array)) VM.bindable = [];
  if (!~VM.bindable.indexOf(propertyName)) VM.bindable.push(propertyName);
}

// Utility to check if the given property is bindable on the given VM.
export function isBindable(vm: ComponentVM, propertyPath: string): boolean {
  let VM = <ComponentClass>vm.constructor;
  let bindable = VM.bindable;
  return bindable instanceof Array && !!~bindable.indexOf(propertyPath);
}

// Requests contextual autoassignment of the given class property. The value is
// identified either by the property name or by a string passed to the
// decorator. Example usage:
//   class X {
//     @assign element: Element;
//   }
export function assign(targetOrKey: any, keyOrNothing?: any): any {
  // Usage without parentheses: @assign myProperty
  if (targetOrKey != null && typeof targetOrKey === 'object' && typeof keyOrNothing === 'string') {
    return assignBase(keyOrNothing)(targetOrKey, keyOrNothing);
  }
  // Usage with parentheses: @assign('key') myProperty
  return assignBase(targetOrKey);
}

function assignBase(tokenName: string) {
  utils.assert(typeof tokenName === 'string', 'expected a string token, got:', tokenName);

  return function(target: {}, propertyName: string): void {
    utils.assert(target != null && typeof target === 'object' &&
                 typeof target.constructor === 'function' && typeof propertyName === 'string',
                 `expected a class prototype, got:`, target);

    let constructor: AttributeClass|ComponentClass = target.constructor;
    if (!constructor.assign) constructor.assign = {};
    constructor.assign[propertyName] = tokenName;
  }
}
