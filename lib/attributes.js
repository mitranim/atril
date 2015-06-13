'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var boot_1 = require('./boot');
var decorators_1 = require('./decorators');
var utils = require('./utils');
var utils_1 = require('./utils');
var Bind = (function () {
    function Bind() {
        this.propertyPath = utils.normalise(this.hint);
        this.pathfinder = new utils_1.Pathfinder(this.propertyPath);
    }
    Bind.prototype.onPhase = function () {
        var result = this.expression(this.scope);
        // Sync the result to the element. Dirty checking avoids setter side effects.
        if (!utils.strictEqual(this.pathfinder.read(this.element), result)) {
            this.pathfinder.assign(this.element, result);
        }
        // If the element has a VM that declares this property as bindable, sync
        // the result to it. Dirty checking avoids setter side effects.
        var vm = this.vm;
        if (vm && decorators_1.isBindable(vm, this.propertyPath) &&
            !utils.strictEqual(this.pathfinder.read(vm), result)) {
            this.pathfinder.assign(vm, result);
        }
    };
    __decorate([
        decorators_1.assign
    ], Bind.prototype, "element");
    __decorate([
        decorators_1.assign
    ], Bind.prototype, "hint");
    __decorate([
        decorators_1.assign
    ], Bind.prototype, "expression");
    __decorate([
        decorators_1.assign
    ], Bind.prototype, "scope");
    __decorate([
        decorators_1.assign
    ], Bind.prototype, "vm");
    Bind = __decorate([
        decorators_1.Attribute({ attributeName: 'bind' })
    ], Bind);
    return Bind;
})();
var TwoWay = (function () {
    function TwoWay() {
        var _this = this;
        utils.assert(utils.isKebabStaticPathAccessor(this.hint), "a 'twoway.*' attribute must be of form 'twoway.X(.X)*', where X is a valid JavaScript identifier in kebab form; got: '" + this.attribute.name + "'");
        this.ownPathfinder = new utils_1.Pathfinder(this.attribute.value);
        this.targetPropertyPath = utils.normalise(this.hint);
        this.targetPathfinder = new utils_1.Pathfinder(this.targetPropertyPath);
        // When dealing with native inputs, add event listeners to trigger phases.
        // For inputs with known events and value properties, sync the value
        // directly in the event listener to avoid double reflow.
        if (this.element.tagName === 'INPUT' || this.element.tagName === 'TEXTAREA') {
            var elem = this.element;
            if (elem.type === 'checkbox') {
                elem.addEventListener('change', function () { _this.syncBottomUp(elem.checked); });
            }
            else {
                elem.addEventListener('input', function () { _this.syncBottomUp(elem.value); });
            }
        }
        else if (this.element.tagName === 'SELECT') {
            var elem = this.element;
            elem.addEventListener('change', function () { _this.syncBottomUp(elem.value); });
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
                this.syncBottomUpAndReflow(targetValue_1);
            if (typeof targetValue_1 !== typeof ownValue)
                this.syncBottomUpAndReflow(targetValue_1);
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
            this.syncBottomUpAndReflow(targetValue);
        }
    };
    TwoWay.prototype.syncTopDown = function (newValue) {
        this.lastOwnValue = newValue;
        this.lastTargetValue = newValue;
        // Sync the result to the element. Dirty checking avoids setter side effects.
        if (!utils.strictEqual(this.targetPathfinder.read(this.element), newValue)) {
            this.targetPathfinder.assign(this.element, newValue);
        }
        // If the element has a VM that declares this property as bindable, sync
        // the result to it. Dirty checking avoids setter side effects.
        var vm = this.vm;
        if (vm && decorators_1.isBindable(vm, this.targetPropertyPath)) {
            if (!utils.strictEqual(this.targetPathfinder.read(vm), newValue)) {
                this.targetPathfinder.assign(vm, newValue);
            }
        }
    };
    TwoWay.prototype.syncBottomUp = function (newValue) {
        this.lastOwnValue = newValue;
        this.lastTargetValue = newValue;
        if (!utils.strictEqual(this.ownPathfinder.read(this.scope), newValue)) {
            this.ownPathfinder.assign(this.scope, newValue);
            return true;
        }
        return false;
    };
    TwoWay.prototype.syncBottomUpAndReflow = function (newValue) {
        if (this.syncBottomUp(newValue))
            boot_1.scheduleReflow();
    };
    TwoWay.prototype.getTargetValue = function () {
        var vm = this.vm;
        if (vm && decorators_1.isBindable(vm, this.targetPropertyPath)) {
            return this.targetPathfinder.read(vm);
        }
        return this.targetPathfinder.read(this.element);
    };
    __decorate([
        decorators_1.assign
    ], TwoWay.prototype, "element");
    __decorate([
        decorators_1.assign
    ], TwoWay.prototype, "attribute");
    __decorate([
        decorators_1.assign
    ], TwoWay.prototype, "hint");
    __decorate([
        decorators_1.assign
    ], TwoWay.prototype, "scope");
    __decorate([
        decorators_1.assign
    ], TwoWay.prototype, "vm");
    TwoWay = __decorate([
        decorators_1.Attribute({ attributeName: 'twoway' })
    ], TwoWay);
    return TwoWay;
})();
var On = (function () {
    function On() {
        var _this = this;
        this.element.addEventListener(this.hint, function (event) {
            var result = _this.expression.call(_this.element, _this.scope, { $event: event });
            if (result === false)
                event.preventDefault();
        });
    }
    __decorate([
        decorators_1.assign
    ], On.prototype, "element");
    __decorate([
        decorators_1.assign
    ], On.prototype, "hint");
    __decorate([
        decorators_1.assign
    ], On.prototype, "expression");
    __decorate([
        decorators_1.assign
    ], On.prototype, "scope");
    On = __decorate([
        decorators_1.Attribute({ attributeName: 'on' })
    ], On);
    return On;
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
    __decorate([
        decorators_1.assign
    ], Class.prototype, "element");
    __decorate([
        decorators_1.assign
    ], Class.prototype, "hint");
    __decorate([
        decorators_1.assign
    ], Class.prototype, "expression");
    __decorate([
        decorators_1.assign
    ], Class.prototype, "scope");
    Class = __decorate([
        decorators_1.Attribute({ attributeName: 'class' })
    ], Class);
    return Class;
})();
var Ref = (function () {
    function Ref() {
        utils.assert(!this.hint || this.hint === 'vm', "expected 'ref.' or 'ref.vm', got: '" + this.attribute.name + "'");
        var pathfinder = new utils_1.Pathfinder(this.attribute.value);
        if (this.scope) {
            pathfinder.assign(this.scope, this.hint === 'vm' ? this.vm : this.element);
        }
    }
    __decorate([
        decorators_1.assign
    ], Ref.prototype, "element");
    __decorate([
        decorators_1.assign
    ], Ref.prototype, "attribute");
    __decorate([
        decorators_1.assign
    ], Ref.prototype, "hint");
    __decorate([
        decorators_1.assign
    ], Ref.prototype, "scope");
    __decorate([
        decorators_1.assign
    ], Ref.prototype, "vm");
    Ref = __decorate([
        decorators_1.Attribute({ attributeName: 'ref' })
    ], Ref);
    return Ref;
})();
