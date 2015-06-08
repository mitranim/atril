'use strict';
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
function randomString() {
    return (Math.random() * Math.pow(10, 16)).toString(16);
}
exports.randomString = randomString;
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
/**
 * Converts the identifier from kebab case to camelcase (if applicable) or
 * leaves it as-is, if it's already valid.
 */
function deKebabibise(name) {
    name = name.replace(/[^A-Za-z.]+/g, ' ');
    for (var i = 0; i < name.length - 1; i++) {
        var prefix = name.slice(0, i + 1);
        var next = name[i + 1];
        if (/[a-z]/.test(name[i]) && /[A-Z]/.test(next)) {
            next = next.toLowerCase();
            name = prefix + ' ' + next + name.slice(i + 2);
        }
    }
    return name.trim().toLowerCase();
}
exports.deKebabibise = deKebabibise;
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
function isValidKebabIdentifier(expression) {
    return /^[$_a-z]+[$_a-z0-9-]*$/.test(expression);
}
exports.isValidKebabIdentifier = isValidKebabIdentifier;
// match[1] -> identifier
// match[2] -> everything else
function matchValidIdentifier(expression) {
    return expression.match(/^([$_A-Za-z]+[$_A-Za-z0-9]*)(.*)/);
}
exports.matchValidIdentifier = matchValidIdentifier;
// match[1] -> identifier
// match[2] -> everything else
function matchValidKebabIdentifier(expression) {
    return expression.match(/^([$_a-z]+[$_a-z0-9-]*)(.*)/);
}
exports.matchValidKebabIdentifier = matchValidKebabIdentifier;
// Checks if something looks like `blah(.blah.blah)*`.
// Doesn't support `blah[blah]` or `blah[0]`.
function isStaticPathAccessor(expression) {
    return /^[$_A-Za-z]+[$_A-Za-z0-9]*(?:\.[$_A-Za-z]+[$_A-Za-z0-9]*)*$/.test(expression);
}
exports.isStaticPathAccessor = isStaticPathAccessor;
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
// User agent sniffing. You're welcome to sniffing the "capability" to randomly
// erase custom properties of Text nodes.
exports.msie = !!document.documentMode;
