'use strict';
var utils = require('./utils');
exports.registeredComponents = Object.create(null);
exports.registeredAttributes = Object.create(null);
exports.registeredMolds = Object.create(null);
function Component(config) {
    var tagRegex = /^[a-z][a-z-]*[a-z]$/;
    // Type checks.
    utils.assert(typeof config.tagName === 'string', "expected a string tagname, got:", config.tagName);
    utils.assert(tagRegex.test(config.tagName), "the tagname must match regex " + tagRegex + ", got:", config.tagName);
    return function (VM) {
        utils.assert(typeof VM === 'function', "expected a component class, got:", VM);
        utils.assert(!exports.registeredComponents[config.tagName], "unexpected redefinition of component with tagname " + config.tagName);
        exports.registeredComponents[config.tagName] = VM;
    };
}
exports.Component = Component;
function Attribute(config) {
    var nameRegex = /^[a-z][a-z-]*[a-z]$/;
    // Type checks.
    utils.assert(typeof config.attributeName === 'string', "expected a string attribute name, got:", config.attributeName);
    utils.assert(nameRegex.test(config.attributeName), "the attribute name must match regex " + nameRegex + ", got:", config.attributeName);
    utils.assert(!exports.registeredAttributes[config.attributeName], "unexpected redefinition of attribute " + config.attributeName);
    return function (VM) {
        utils.assert(typeof VM === 'function', "expected an attribute class, got:", VM);
        exports.registeredAttributes[config.attributeName] = VM;
    };
}
exports.Attribute = Attribute;
function Mold(config) {
    return function (VM) {
        Attribute(config)(VM);
        exports.registeredMolds[config.attributeName] = true;
    };
}
exports.Mold = Mold;
// Marks a property as bindable for databinding. Example usage:
//   class X {
//     @bindable myProperty: any;
//   }
function bindable(target, propertyName) {
    if (!target)
        return;
    var VM = (target.constructor);
    if (!(VM.bindable instanceof Array))
        VM.bindable = [];
    if (!~VM.bindable.indexOf(propertyName))
        VM.bindable.push(propertyName);
}
exports.bindable = bindable;
// Utility to check if the given property is bindable on the given VM.
function isBindable(vm, propertyPath) {
    var VM = vm.constructor;
    var bindable = VM.bindable;
    return bindable instanceof Array && !!~bindable.indexOf(propertyPath);
}
exports.isBindable = isBindable;
// Requests contextual autoassignment of the given class property. The value is
// identified either by the property name or by a string passed to the
// decorator. Example usage:
//   class X {
//     @assign element: Element;
//   }
function assign(targetOrKey, keyOrNothing) {
    // Usage without parentheses: @assign myProperty
    if (targetOrKey != null && typeof targetOrKey === 'object' && typeof keyOrNothing === 'string') {
        return assignBase(keyOrNothing)(targetOrKey, keyOrNothing);
    }
    // Usage with parentheses: @assign('key') myProperty
    return assignBase(targetOrKey);
}
exports.assign = assign;
function assignBase(tokenName) {
    utils.assert(typeof tokenName === 'string', 'expected a string token, got:', tokenName);
    return function (target, propertyName) {
        utils.assert(target != null && typeof target === 'object' &&
            typeof target.constructor === 'function' && typeof propertyName === 'string', "expected a class prototype, got:", target);
        var constructor = target.constructor;
        if (!constructor.assign)
            constructor.assign = {};
        constructor.assign[propertyName] = tokenName;
    };
}
