var AttributeBinding = (function () {
    function AttributeBinding(attr, VM) {
        this.name = attr.name;
        this.value = attr.value;
        this.hint = attr.name.match(/^[a-z-]+\.(.*)/)[1];
        this.expression = compileExpression(attr.value);
        this.VM = VM;
    }
    AttributeBinding.prototype.refreshState = function (element, state, scope) {
        var isNew = this.isNew;
        if (isNew) {
            this.vm = Object.create(this.VM.prototype);
            this.vm.hint = this.hint;
            this.vm.expression = this.expression;
        }
        this.vm.element = element;
        this.vm.scope = scope;
        this.vm.component = state.vm || null;
        if (isNew)
            this.VM.call(this.vm);
    };
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
        this.name = attr.name;
        this.value = attr.value;
        this.expression = compileTextExpression(attr.textContent);
    }
    return AttributeInterpolation;
})();
exports.AttributeInterpolation = AttributeInterpolation;
// Problems:
// * Provides access to globals.
// * Doesn't assign to missing properties (throws a reference error).
// * Has to be re-interpreted on each call to support locals that don't mess
//   with property assignment in scopes.
function compileExpression(expression) {
    if (!expression)
        return function () { return undefined; };
    return function (scope, locals) {
        // Prevent `with` from throwing an error when the scope is empty.
        if (scope == null)
            scope = Object.create(null);
        var argList = [];
        var argValues = [];
        if (locals != null && typeof locals === 'object') {
            argList = Object.keys(locals);
            for (var i = 0, ii = argList.length; i < ii; ++i) {
                argValues.push(locals[argList[i]]);
            }
        }
        argValues.push(scope);
        var returnPrefix = ~expression.indexOf(';') ? '' : 'return ';
        var body = "with (arguments[" + (argValues.length - 1) + "]) {\n      return function() {'use strict';\n        " + returnPrefix + expression + "\n      }.call(this);\n    }";
        argList.push(body);
        var func = Function.apply(void 0, argList);
        return func.call.apply(func, [this === window ? scope : this].concat(argValues));
    };
}
exports.compileExpression = compileExpression;
function hasInterpolation(text) {
    return /\{\{((?:[^}]|}(?=[^}]))*)\}\}/g.test(text);
}
exports.hasInterpolation = hasInterpolation;
function compileTextExpression(text) {
    if (!text)
        return function () { return ''; };
    var reg = /\{\{((?:[^}]|}(?=[^}]))*)\}\}/g;
    var result;
    var collection = [];
    var slice = text;
    while (result = reg.exec(slice)) {
        var piece = slice.slice(0, result.index);
        if (piece)
            collection.push(piece);
        slice = slice.slice(result.index).replace(result[0], '');
        collection.push(compileExpression(result[1]));
    }
    if (slice)
        collection.push(slice);
    return function (scope, locals) {
        if (scope == null)
            return '';
        var total = '';
        for (var i = 0, ii = collection.length; i < ii; ++i) {
            var item = collection[i];
            if (typeof item === 'string') {
                total += item;
                continue;
            }
            var result_1 = item.call(scope, scope, locals);
            if (result_1 != null)
                total += result_1;
        }
        return total;
    };
}
exports.compileTextExpression = compileTextExpression;
