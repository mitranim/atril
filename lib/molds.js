'use strict';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var decorators_1 = require('./decorators');
var tree_1 = require('./tree');
var utils = require('./utils');
var If = (function () {
    function If() {
        this.stash = [];
        utils.assert(this.hint === '', "custom attribute 'if' doesn't support hints, got " + this.hint);
        var container = this.element.content;
        while (container.hasChildNodes()) {
            var child = container.removeChild(container.lastChild);
            tree_1.Meta.getOrAddMeta(child).isDomImmutable = true;
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
    __decorate([
        decorators_1.assign
    ], If.prototype, "element");
    __decorate([
        decorators_1.assign
    ], If.prototype, "hint");
    __decorate([
        decorators_1.assign
    ], If.prototype, "expression");
    __decorate([
        decorators_1.assign
    ], If.prototype, "scope");
    If = __decorate([
        decorators_1.Mold({ attributeName: 'if' })
    ], If);
    return If;
})();
var For = (function () {
    function For() {
        this.originals = [];
        this.stash = [];
        var msg = "the 'for.*' attribute expects a hint in the form of 'X.of', 'X.in', or 'X', where X is a valid JavaScript identifier; received '" + this.hint + "'";
        var match = utils.matchValidKebabIdentifier(this.hint);
        utils.assert(!!match, msg);
        // Find the variable key.
        this.key = utils.normalise(match[1]);
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
                tree_1.Meta.getOrAddMeta(clone).isDomImmutable = true;
                return clone;
            });
        }
        while (nodes.length) {
            var node = nodes.shift();
            this.element.appendChild(node);
            tree_1.Meta.getOrAddMeta(node).insertScope((_a = {
                    $index: index
                },
                _a[this.key] = value[index],
                _a
            ));
        }
        var _a;
    };
    __decorate([
        decorators_1.assign
    ], For.prototype, "element");
    __decorate([
        decorators_1.assign
    ], For.prototype, "hint");
    __decorate([
        decorators_1.assign
    ], For.prototype, "expression");
    __decorate([
        decorators_1.assign
    ], For.prototype, "scope");
    For = __decorate([
        decorators_1.Mold({ attributeName: 'for' })
    ], For);
    return For;
})();
var Let = (function () {
    function Let() {
        utils.assert(utils.isValidKebabIdentifier(this.hint), "'let.*' expects the hint to be a valid JavaScript identifier in kebab form, got: '" + this.hint + "'");
        var identifier = utils.normalise(this.hint);
        // Make sure a scope is available.
        if (!this.scope) {
            var meta = tree_1.Meta.getOrAddMeta(this.element);
            meta.insertScope();
            this.scope = meta.scope;
        }
        // The identifier must not be redeclared in the scope. We're being strict to
        // safeguard against elusive errors.
        utils.assert(!Object.prototype.hasOwnProperty.call(this.scope, identifier), "unexpected re-declaration of '" + identifier + "' with 'let'");
        // Bring the identifier into scope, assigning the given value.
        this.scope[identifier] = this.expression.call(this.scope, this.scope);
        // Pass through any content.
        var content = this.element.content;
        while (content.hasChildNodes()) {
            this.element.appendChild(content.removeChild(content.firstChild));
        }
    }
    __decorate([
        decorators_1.assign
    ], Let.prototype, "element");
    __decorate([
        decorators_1.assign
    ], Let.prototype, "hint");
    __decorate([
        decorators_1.assign
    ], Let.prototype, "expression");
    __decorate([
        decorators_1.assign
    ], Let.prototype, "scope");
    Let = __decorate([
        decorators_1.Mold({ attributeName: 'let' })
    ], Let);
    return Let;
})();
