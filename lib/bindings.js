'use strict';
var AttributeBinding = (function () {
    function AttributeBinding(attr, VM) {
        this.name = attr.name;
        this.value = attr.value;
        this.hint = attr.name.match(/^[a-z-]+\.(.*)/)[1];
        this.expression = compileExpression(attr.value);
        this.VM = VM;
    }
    AttributeBinding.prototype.refreshState = function (element, meta) {
        var isNew = this.isNew;
        if (isNew) {
            this.vm = Object.create(this.VM.prototype);
            this.vm.hint = this.hint;
            this.vm.expression = this.expression;
            this.vm.element = element;
            this.vm.component = meta.vm || null;
        }
        var scope = meta.getScope();
        if (this.vm.scope !== scope)
            this.vm.scope = scope;
        if (isNew)
            this.VM.call(this.vm);
    };
    // Indicates if the attribute was phased. Used to decide if the mold output
    // needs to be recompiled and/or re-rendered.
    AttributeBinding.prototype.phase = function () {
        if (typeof this.vm.onPhase === 'function') {
            return this.vm.onPhase(), true;
        }
        return false;
    };
    AttributeBinding.prototype.destroy = function () {
        if (typeof this.vm.onDestroy === 'function') {
            this.vm.onDestroy();
        }
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
        this.expression = compileInterpolation(attr.textContent);
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
        // Prevent `with` from throwing an error when the scope or the locals are
        // empty.
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
        collection.push(compileExpression(result[1]));
    }
    var slice = text.slice(lastIndex);
    if (slice)
        collection.push(slice);
    return function (scope) {
        var total = '';
        for (var _i = 0; _i < collection.length; _i++) {
            var item = collection[_i];
            total += typeof item === 'string' ? item : item.call(this, scope);
        }
        return total;
    };
}
exports.compileInterpolation = compileInterpolation;
