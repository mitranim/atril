'use strict';
function uniqueKey(hint) {
    if (typeof Symbol === 'function')
        return Symbol(hint);
    return hint + '_' + randomString();
}
exports.uniqueKey = uniqueKey;
function randomString() {
    return (Math.random() * Math.pow(10, 16)).toString(16);
}
/**
 * Normalises a string, converting everything except symbols valid in
 * JavaScript identifiers and dots into singular spaces and joining them via
 * camelcase.
 */
function normalise(name) {
    name = name.replace(/[^$_A-Za-z0-9.]+/g, ' ');
    return name.split(/\s+/g).map(function (chunk, index) {
        if (!index)
            return chunk;
        return chunk[0].toUpperCase() + chunk.slice(1);
    }).join('');
}
exports.normalise = normalise;
function looksLikeCustomAttribute(attributeName) {
    return /^[a-z-]+\./.test(attributeName);
}
exports.looksLikeCustomAttribute = looksLikeCustomAttribute;
function customAttributeName(attributeName) {
    return attributeName.match(/^([a-z-]+)\./)[1];
}
exports.customAttributeName = customAttributeName;
function isArrayLike(value) {
    if (!value)
        return false;
    return value instanceof Array || typeof value === 'string' ||
        typeof value.length === 'number' && value.length >= 0;
}
exports.isArrayLike = isArrayLike;
function strictEqual(one, other) {
    // NaN is the only value that doesn't equal itself.
    // For our purposes, NaN === NaN -> true.
    return one === other || typeof one === 'number' && typeof other === 'number';
}
exports.strictEqual = strictEqual;
function cloneDeep(node) {
    var clone = node.cloneNode();
    // When cloning a <template> in a supporting browser, or if the template is
    // shimmed, copy nodes from its content fragment to the content fragment of
    // the clone.
    var container = node instanceof Element && node.tagName === 'TEMPLATE' &&
        node.content || node;
    var clonedContainer = clone instanceof Element && clone.tagName === 'TEMPLATE' &&
        clone.content || clone;
    for (var i = 0, ii = container.childNodes.length; i < ii; ++i) {
        clonedContainer.appendChild(cloneDeep(container.childNodes[i]));
    }
    return clone;
}
exports.cloneDeep = cloneDeep;
// For browsers like IE that don't natively support `.content` on <template>
// elements.
function shimTemplateContent(template) {
    if (!template.content) {
        var fragment = document.createDocumentFragment();
        Object.defineProperty(template, 'content', {
            get: function () { return fragment; },
            set: function () { }
        });
        while (template.hasChildNodes()) {
            fragment.appendChild(template.removeChild(template.firstChild));
        }
    }
}
exports.shimTemplateContent = shimTemplateContent;
// 1. Empty text nodes are sometimes treated as missing by browsers, tripping
//    up our mechanisms that depend on child count and order, like `for.`.
// 2. In IE11, when a MutationObserver is enabled _anywhere_ in the document,
//    the browser sometimes splits text nodes, tripping up interpolation.
function pruneTextNodes(node) {
    var isPre = false;
    var current = node;
    do {
        if (isPre = (current instanceof HTMLPreElement))
            break;
    } while (current = current.parentElement);
    for (var i = node.childNodes.length - 1; i >= 0; --i) {
        var child = node.childNodes[i];
        if (child instanceof Text) {
            // Keep whitespace in a `<pre>` and remove anywhere else.
            if (!isPre && /^\s*$/.test(child.textContent)) {
                node.removeChild(child);
                continue;
            }
            // Merge adjacent text nodes.
            var sibling = node.childNodes[i + 1];
            if (sibling instanceof Text) {
                child.textContent += sibling.textContent;
                node.removeChild(sibling);
            }
        }
    }
    if (node instanceof Element && node.tagName === 'TEMPLATE') {
        pruneTextNodes(node.content);
    }
}
exports.pruneTextNodes = pruneTextNodes;
function isValidIdentifier(expression) {
    return /^[$_A-Za-z]+[$_A-Za-z0-9]*$/.test(expression);
}
exports.isValidIdentifier = isValidIdentifier;
// match[1] -> identifier
// match[2] -> everything else
function matchValidIdentifier(expression) {
    return expression.match(/^([$_A-Za-z]+[$_A-Za-z0-9]*)(.*)/);
}
exports.matchValidIdentifier = matchValidIdentifier;
// Checks if something looks like `blah(.blah.blah)*`.
// Doesn't support `blah[blah]` or `blah[0]`.
function isStaticPathAccessor(expression) {
    return /^[$_A-Za-z]+[$_A-Za-z0-9]*(?:\.[$_A-Za-z]+[$_A-Za-z0-9]*)*$/.test(expression);
}
exports.isStaticPathAccessor = isStaticPathAccessor;
// TODO forbid consequtive hyphens and trailing hyphen.
function isValidKebabIdentifier(expression) {
    return /^[$_a-z]+[$_a-z0-9-]*$/.test(expression);
}
exports.isValidKebabIdentifier = isValidKebabIdentifier;
// match[1] -> identifier
// match[2] -> everything else
// TODO forbid consequtive hyphens and trailing hyphen.
function matchValidKebabIdentifier(expression) {
    return expression.match(/^([$_a-z]+[$_a-z0-9-]*)(.*)/);
}
exports.matchValidKebabIdentifier = matchValidKebabIdentifier;
// Checks if something looks like `blah(.blah-blah.blah-blah)*`.
// Doesn't support `blah[blah]` or `blah[0]`.
// TODO forbid consequtive hyphens and trailing hyphen.
function isKebabStaticPathAccessor(expression) {
    return /^[$_a-z]+[$_a-z0-9-]*(?:\.[$_a-z]+[$_a-z0-9-]*)*$/.test(expression);
}
exports.isKebabStaticPathAccessor = isKebabStaticPathAccessor;
var consoleWarnAvailable = typeof console !== 'undefined' && console && typeof console.warn === 'function';
function warn(msg, extra) {
    if (!consoleWarnAvailable)
        return;
    // warn.apply doesn't print error stack
    if (arguments.length > 2)
        console.warn(msg, extra);
    else
        console.warn(msg);
}
exports.warn = warn;
var consoleErrorAvailable = typeof console !== 'undefined' && console && typeof console.error === 'function';
function error(msg, extra) {
    if (!consoleErrorAvailable)
        return;
    // error.apply doesn't print error stack
    if (arguments.length > 2)
        console.error(msg, extra);
    else
        console.error(msg);
}
exports.error = error;
// Can't use console.assert because it doesn't interrupt the control flow.
function assert(ok, msg, extra) {
    if (ok)
        return;
    if (consoleErrorAvailable) {
        // error.apply doesn't print error stack
        if (arguments.length > 2)
            console.error(msg, extra);
        else
            console.error(msg);
    }
    if (arguments.length > 2)
        msg += extra;
    throw new Error(msg);
}
exports.assert = assert;
// Can be sync or async. No guarantees. We really want to be sync when possible
// in order to pause the UI thread.
function onload(callback) {
    if (document.readyState === 'loaded' ||
        document.readyState === 'complete' ||
        document.readyState === 'interactive') {
        callback();
    }
    else {
        document.addEventListener('DOMContentLoaded', function cb() {
            document.removeEventListener('DOMContentLoaded', cb);
            callback();
        });
    }
}
exports.onload = onload;
// User agent sniffing. You're welcome to detecting the "capability" to randomly
// erase custom properties of Text nodes.
exports.msie = !!document.documentMode;
// FF has a tendency to reverse attribute order when parsing HTML into DOM.
var testDiv = document.createElement('div');
testDiv.innerHTML = '<template one two></template>';
exports.browserReversesAttributes = testDiv.childNodes[0].attributes[0].name === 'two';
// Dependency resolver. Takes a class and a context that defines dependencies,
// creates an instance, and assigns dependencies before calling the instance's
// constructor. Returns the complete instance.
function instantiate(constructor, context) {
    assert(typeof constructor === 'function', "can't instantiate a non-function:", constructor);
    assert(!!context, "can't instantiate with no context");
    var instance = Object.create(constructor.prototype);
    var tokenMap = constructor.assign;
    if (tokenMap != null && typeof tokenMap === 'object') {
        // Expecting a hash table.
        for (var propertyName in tokenMap) {
            var token = tokenMap[propertyName];
            assert(token in context, "value '" + token + "' is not defined in the current context");
            instance[propertyName] = context[token];
        }
    }
    // Instantiate.
    constructor.call(instance);
    return instance;
}
exports.instantiate = instantiate;
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
        for (var _i = 0, _a = this.track; _i < _a.length; _i++) {
            var item = _a[_i];
            source = source[item];
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
exports.Pathfinder = Pathfinder;
