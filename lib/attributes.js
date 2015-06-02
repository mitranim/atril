'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var atril_1 = require('./atril');
var utils = require('./utils');
var Bind = (function () {
    function Bind() {
        this.propertyPath = utils.camelCase(this.hint);
        this.pathfinder = new Pathfinder(this.propertyPath);
    }
    Bind.prototype.onPhase = function () {
        var result = this.expression(this.scope);
        // Sync the result to the element. Dirty checking avoids setter side effects.
        if (!utils.strictEqual(this.pathfinder.read(this.element), result)) {
            this.pathfinder.assign(this.element, result);
        }
        // If the element has a VM that declares this property as bindable, sync
        // the result to it. Dirty checking avoids setter side effects.
        var vm = this.component;
        if (vm && isBindable(vm, this.propertyPath) &&
            !utils.strictEqual(this.pathfinder.read(vm), result)) {
            this.pathfinder.assign(vm, result);
        }
    };
    Bind = __decorate([
        atril_1.Attribute({ attributeName: 'bind' })
    ], Bind);
    return Bind;
})();
var TwoWay = (function () {
    function TwoWay() {
        var attributeName = 'twoway.' + this.hint;
        // ToDo validate the hint accessor the same way as the expression.
        console.assert(!!this.hint, "a 'twoway.*' attribute must be of form 'twoway.X' or 'twoway.X.X[...]', where X is a valid JavaScript identifier; got: '" + attributeName + "'");
        var expression = this.element.getAttribute(attributeName) || '';
        // Split the expression into subpath accessors.
        var keys = expression.split('.');
        // Validate each accessor as a JavaScript identifier.
        var valid = true;
        for (var i = 0, ii = keys.length; i < ii; ++i) {
            var key = keys[i];
            if (valid)
                valid = /^[$_A-Za-z]+[$_A-Za-z0-9]*$/.test(key);
            if (!valid)
                break;
        }
        console.assert(valid, "a twoway binding expression must be of form 'X' or 'X[.X]', where X is a valid JavaScript identifier; got: '" + expression + "'");
        this.ownPathfinder = new Pathfinder(expression);
        this.targetPropertyPath = utils.camelCase(this.hint);
        this.targetPathfinder = new Pathfinder(this.targetPropertyPath);
        // Event listeners to trigger phases.
        if (this.element.tagName === 'INPUT' || this.element.tagName === 'TEXTAREA') {
            var elem = this.element;
            var eventName = {
                checkbox: 'change',
                select: 'select',
                button: 'click'
            }[elem.type] || 'input';
            this.element.addEventListener(eventName, function () { });
        }
    }
    TwoWay.prototype.onPhase = function () {
        var firstPhase = !this.hasOwnProperty('lastOwnValue');
        var ownValue = this.ownPathfinder.read(this.scope);
        if (firstPhase) {
            var targetValue_1 = this.getTargetValue();
            if (ownValue && !targetValue_1)
                this.syncTopDown(ownValue);
            if (targetValue_1 && !ownValue)
                this.syncBottomUp(targetValue_1);
            if (typeof targetValue_1 !== typeof ownValue)
                this.syncBottomUp(targetValue_1);
            else
                this.syncTopDown(ownValue);
            return;
        }
        // If own value has changed, overwrite the others. Own takes priority.
        if (!utils.strictEqual(ownValue, this.lastOwnValue)) {
            this.syncTopDown(ownValue);
            return;
        }
        // Otherwise sync the data back from the target. Don't bother syncing the
        // data between the target element and its VM.
        var targetValue = this.getTargetValue();
        if (!utils.strictEqual(targetValue, this.lastTargetValue)) {
            this.syncBottomUp(targetValue);
        }
    };
    TwoWay.prototype.syncTopDown = function (newValue) {
        var needReflow = false;
        this.lastOwnValue = newValue;
        this.lastTargetValue = newValue;
        // Sync the result to the element. Dirty checking avoids setter side effects.
        if (!utils.strictEqual(this.targetPathfinder.read(this.element), newValue)) {
            this.targetPathfinder.assign(this.element, newValue);
            needReflow = true;
        }
        // If the element has a VM that declares this property as bindable, sync
        // the result to it. Dirty checking avoids setter side effects.
        var vm = this.component;
        if (vm && isBindable(vm, this.targetPropertyPath)) {
            if (!utils.strictEqual(this.targetPathfinder.read(vm), newValue)) {
                this.targetPathfinder.assign(vm, newValue);
                needReflow = true;
            }
        }
        if (needReflow)
            atril_1.scheduleReflow();
    };
    TwoWay.prototype.syncBottomUp = function (newValue) {
        this.lastOwnValue = newValue;
        this.lastTargetValue = newValue;
        if (!utils.strictEqual(this.ownPathfinder.read(this.scope), newValue)) {
            this.ownPathfinder.assign(this.scope, newValue);
            atril_1.scheduleReflow();
        }
    };
    TwoWay.prototype.getTargetValue = function () {
        var vm = this.component;
        if (vm && isBindable(vm, this.targetPropertyPath)) {
            return this.targetPathfinder.read(vm);
        }
        return this.targetPathfinder.read(this.element);
    };
    TwoWay = __decorate([
        atril_1.Attribute({ attributeName: 'twoway' })
    ], TwoWay);
    return TwoWay;
})();
function isBindable(vm, propertyPath) {
    var VM = vm.constructor;
    var bindable = VM.bindable;
    return bindable instanceof Array && !!~bindable.indexOf(propertyPath);
}
var Pathfinder = (function () {
    function Pathfinder(path) {
        this.track = path.split('.');
        if (this.track.length === 1)
            this.key = path;
    }
    Pathfinder.prototype.read = function (source) {
        if (this.key)
            return source[this.key];
        var track = this.track;
        for (var i = 0, ii = track.length; i < ii; ++i) {
            source = source[track[i]];
        }
        return source;
    };
    Pathfinder.prototype.assign = function (target, value) {
        if (this.key)
            target[this.key] = value;
        var track = this.track;
        for (var i = 0, ii = track.length - 1; i < ii; ++i) {
            target = target[track[i]];
        }
        target[track[i]] = value;
    };
    return Pathfinder;
})();
var On = (function () {
    function On() {
        var _this = this;
        this.element.addEventListener(this.hint, function (event) {
            _this.expression.call(_this.element, _this.scope, { $event: event });
        });
    }
    On = __decorate([
        atril_1.Attribute({ attributeName: 'on' })
    ], On);
    return On;
})();
var If = (function () {
    function If() {
        // Custom
        this.stash = [];
        console.assert(this.hint === '', "custom attribute 'if' doesn't support hints, got " + this.hint);
        var container = this.element.content;
        while (container.hasChildNodes()) {
            this.stash.unshift(container.removeChild(container.lastChild));
        }
    }
    If.prototype.onPhase = function () {
        var ok = !!this.expression(this.scope);
        if (ok)
            while (this.stash.length) {
                this.element.appendChild(this.stash.shift());
            }
        else
            while (this.element.hasChildNodes()) {
                this.stash.unshift(this.element.removeChild(this.element.lastChild));
            }
    };
    If = __decorate([
        atril_1.Draft({ attributeName: 'if' })
    ], If);
    return If;
})();
var For = (function () {
    function For() {
        this.originals = [];
        this.stash = [];
        // Validate the hint.
        var ofReg = /^[$_A-Za-z]+[$_A-Za-z0-9]*.of$/;
        var inReg = /^[$_A-Za-z]+[$_A-Za-z0-9]*.in$/;
        var anyReg = /^[$_A-Za-z]+[$_A-Za-z0-9]*$/;
        console.assert(ofReg.test(this.hint) || inReg.test(this.hint) || anyReg.test(this.hint), "the 'for.*' attribute expects a hint in the form of 'X.of', 'X.in', or 'X', where X is a valid JavaScript identifier; received '" + this.hint + "'");
        this.key = this.hint.match(/^[$_A-Za-z]+[$_A-Za-z0-9]*/)[0];
        // Choose the iteration strategy.
        this.mode = ofReg.test(this.hint) ? 'of' : inReg.test(this.hint) ? 'in' : 'any';
        // Move the initial content to a safer place.
        var container = this.element.content;
        while (container.hasChildNodes()) {
            this.originals.unshift(container.removeChild(container.lastChild));
        }
    }
    For.prototype.onPhase = function () {
        var value = this.expression(this.scope);
        var isIterable = value instanceof Array || typeof value === 'string' ||
            (value != null && typeof value === 'object' && this.mode !== 'of');
        // Stash existing content.
        while (this.element.hasChildNodes()) {
            this.stash.unshift(this.element.removeChild(this.element.lastChild));
        }
        if (!isIterable || !this.originals.length)
            return;
        if (this.mode === 'in' || !utils.isArrayLike(value))
            this.iterateIn(value);
        else
            this.iterateOf(value);
    };
    For.prototype.iterateOf = function (value) {
        for (var i = 0, ii = value.length; i < ii; ++i) {
            this.step(value, i);
        }
    };
    For.prototype.iterateIn = function (value) {
        for (var key in value)
            this.step(value, key);
    };
    For.prototype.step = function (value, index) {
        var nodes = this.stash.length >= this.originals.length ?
            this.stash.splice(0, this.originals.length) :
            this.originals.map(utils.cloneDeep);
        var state = atril_1.getOrAddState(nodes[0]);
        if (!state.scope)
            state.scope = Object.create(this.scope);
        state.scope.$index = index;
        state.scope[this.key] = value[index];
        while (nodes.length) {
            var node = nodes.shift();
            atril_1.getOrAddState(node).scope = state.scope;
            this.element.appendChild(node);
        }
    };
    For = __decorate([
        atril_1.Draft({ attributeName: 'for' })
    ], For);
    return For;
})();
var Class = (function () {
    function Class() {
    }
    Class.prototype.onPhase = function () {
        var result = this.expression(this.scope);
        if (result)
            this.element.classList.add(this.hint);
        else
            this.element.classList.remove(this.hint);
    };
    Class = __decorate([
        atril_1.Attribute({ attributeName: 'class' })
    ], Class);
    return Class;
})();
