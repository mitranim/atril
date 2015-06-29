'use strict';
var bindings_1 = require('./bindings');
var utils = require('./utils');
var AttributeBinding = (function () {
    function AttributeBinding(attr, VM) {
        this.attr = attr;
        this.VM = VM;
    }
    AttributeBinding.prototype.refreshAndPhase = function (element, meta) {
        this.refreshState(element, meta);
        return this.phase();
    };
    AttributeBinding.prototype.refreshState = function (element, meta) {
        if (!this.isNew)
            return;
        var attr = this.attr;
        this.vm = utils.instantiate(this.VM, {
            attribute: attr,
            element: element,
            get expression() { return bindings_1.compileExpression(attr.value); },
            get scope() { return meta.getScope(); },
            get hint() { return attr.name.match(/^[a-z-]+\.(.*)/)[1]; },
            vm: meta.vm
        });
    };
    // The return value indicates if the attribute was phased. Used to decide if
    // the mold output needs to be recompiled and/or re-rendered.
    AttributeBinding.prototype.phase = function () {
        if (typeof this.vm.onPhase === 'function') {
            return this.vm.onPhase(), true;
        }
        return false;
    };
    AttributeBinding.prototype.destroy = function () {
        utils.assert(!!this.vm, "unexpected destroy() call on binding without vm:", this);
        if (typeof this.vm.onDestroy === 'function') {
            this.vm.onDestroy();
        }
        this.vm = null;
    };
    Object.defineProperty(AttributeBinding.prototype, "isNew", {
        get: function () { return !this.vm; },
        enumerable: true,
        configurable: true
    });
    return AttributeBinding;
})();
exports.AttributeBinding = AttributeBinding;
var AttributeInterpolation = (function () {
    function AttributeInterpolation(attr) {
        this.attr = attr;
        this.expression = compileInterpolation(attr.value);
    }
    return AttributeInterpolation;
})();
exports.AttributeInterpolation = AttributeInterpolation;
// Problem: provides access to globals.
function compileExpression(expression) {
    if (!expression)
        return function () { return undefined; };
    var returnPrefix = ~expression.indexOf(';') ? '' : 'return ';
    var body = "with (arguments[0]) with (arguments[1]) {\n    return function() {'use strict';\n      " + returnPrefix + expression + "\n    }.call(this);\n  }";
    var func = new Function(body);
    return function (scope, locals) {
        // Prevent `with` from throwing an error when `scope` and/or `locals` have
        // no properties.
        if (scope == null)
            scope = Object.create(null);
        if (locals == null)
            locals = Object.create(null);
        return func.call(this === window ? scope : this, scope, locals);
    };
}
exports.compileExpression = compileExpression;
function hasInterpolation(text) {
    return /\{\{((?:[^}]|}(?=[^}]))*)\}\}/g.test(text);
}
exports.hasInterpolation = hasInterpolation;
function compileInterpolation(text) {
    if (!text)
        return function () { return ''; };
    var reg = /\{\{((?:[^}]|}(?=[^}]))*)\}\}/g;
    var result;
    var collection = [];
    var lastIndex = 0;
    while (result = reg.exec(text)) {
        var slice_1 = text.slice(lastIndex, result.index);
        if (slice_1)
            collection.push(slice_1);
        lastIndex = result.index + result[0].length;
        collection.push(bindings_1.compileExpression(result[1]));
    }
    var slice = text.slice(lastIndex);
    if (slice)
        collection.push(slice);
    return function (scope) {
        var total = '';
        for (var _i = 0; _i < collection.length; _i++) {
            var item = collection[_i];
            if (typeof item === 'string')
                total += item;
            else {
                var result_1 = item.call(this, scope);
                if (result_1 != null)
                    total += result_1;
            }
        }
        return total;
    };
}
exports.compileInterpolation = compileInterpolation;
