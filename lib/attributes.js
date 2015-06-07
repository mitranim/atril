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
var tree_1 = require('./tree');
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
        boot_1.Attribute({ attributeName: 'bind' })
    ], Bind);
    return Bind;
})();
var TwoWay = (function () {
    function TwoWay() {
        var attributeName = 'twoway.' + this.hint;
        utils.assert(utils.isStaticPathAccessor(this.hint), "a 'twoway.*' attribute must be of form 'twoway.X(.X)*', where X is a valid JavaScript identifier; got: '" + attributeName + "'");
        var expression = this.element.getAttribute(attributeName) || '';
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
        this.lastOwnValue = newValue;
        this.lastTargetValue = newValue;
        // Sync the result to the element. Dirty checking avoids setter side effects.
        if (!utils.strictEqual(this.targetPathfinder.read(this.element), newValue)) {
            this.targetPathfinder.assign(this.element, newValue);
        }
        // If the element has a VM that declares this property as bindable, sync
        // the result to it. Dirty checking avoids setter side effects.
        var vm = this.component;
        if (vm && isBindable(vm, this.targetPropertyPath)) {
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
            boot_1.scheduleReflow();
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
        boot_1.Attribute({ attributeName: 'twoway' })
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
            var result = _this.expression.call(_this.element, _this.scope, { $event: event });
            if (result === false)
                event.preventDefault();
        });
    }
    On = __decorate([
        boot_1.Attribute({ attributeName: 'on' })
    ], On);
    return On;
})();
var If = (function () {
    function If() {
        // Custom
        this.stash = [];
        utils.assert(this.hint === '', "custom attribute 'if' doesn't support hints, got " + this.hint);
        var container = this.element.content;
        while (container.hasChildNodes()) {
            var child = container.removeChild(container.lastChild);
            tree_1.getOrAddTrace(child).isDomImmutable = true;
            this.stash.unshift(child);
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
        boot_1.Mold({ attributeName: 'if' })
    ], If);
    return If;
})();
var For = (function () {
    function For() {
        this.originals = [];
        this.stash = [];
        var msg = "the 'for.*' attribute expects a hint in the form of 'X.of', 'X.in', or 'X', where X is a valid JavaScript identifier; received '" + this.hint + "'";
        var match = utils.matchValidIdentifier(this.hint);
        utils.assert(!!match, msg);
        // Find the variable key.
        this.key = match[1];
        // Choose the iteration strategy.
        if (!match[2])
            this.mode = 'any';
        else if (match[2] === '.of')
            this.mode = 'of';
        else if (match[2] == '.in')
            this.mode = 'in';
        utils.assert(!!this.mode, msg);
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
        var nodes;
        if (this.stash.length >= this.originals.length) {
            nodes = this.stash.splice(0, this.originals.length);
        }
        else {
            nodes = this.originals.map(function (node) {
                var clone = utils.cloneDeep(node);
                tree_1.getOrAddTrace(clone).isDomImmutable = true;
                return clone;
            });
        }
        while (nodes.length) {
            var node = nodes.shift();
            tree_1.getOrAddTrace(node).insertScope((_a = {
                    $index: index
                },
                _a[this.key] = value[index],
                _a
            ));
            this.element.appendChild(node);
        }
        var _a;
    };
    For = __decorate([
        boot_1.Mold({ attributeName: 'for' })
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
        boot_1.Attribute({ attributeName: 'class' })
    ], Class);
    return Class;
})();
var Ref = (function () {
    function Ref() {
        utils.assert(!this.hint || this.hint === 'vm', "expected 'ref.' or 'ref.vm', got: 'ref." + this.hint + "'");
        var value = this.element.getAttribute('ref.' + this.hint);
        var pathfinder = new Pathfinder(value);
        if (this.scope) {
            pathfinder.assign(this.scope, this.hint ? this.component : this.element);
        }
    }
    Ref = __decorate([
        boot_1.Attribute({ attributeName: 'ref' })
    ], Ref);
    return Ref;
})();
var Let = (function () {
    function Let() {
        utils.assert(utils.isValidIdentifier(this.hint), "'let.*' expects the hint to be a valid JavaScript identifier, got: '" + this.hint + "'");
        // Make sure a scope is available.
        if (!this.scope) {
            var trace = tree_1.getOrAddTrace(this.element);
            trace.scope = Object.create(null);
            this.scope = trace.scope;
        }
        // The identifier must not be redeclared in the scope. We're being strict to
        // safeguard against elusive errors.
        utils.assert(!Object.prototype.hasOwnProperty.call(this.scope, this.hint), "unexpected re-declaration of '" + this.hint + "'' with 'let'");
        // Bring the identifier into scope, assigning the given value.
        this.scope[this.hint] = this.expression.call(this.scope, this.scope);
        // Pass through any content.
        var content = this.element.content;
        while (content.hasChildNodes()) {
            this.element.appendChild(content.removeChild(content.firstChild));
        }
    }
    Let = __decorate([
        boot_1.Mold({ attributeName: 'let' })
    ], Let);
    return Let;
})();
