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
 * Normalises a string, converting everything except English letters and dots
 * into singular spaces, inserting spaces into case boundaries, and
 * lowercasing.
 */
function normalise(name) {
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
/**
 * Converts an identifier into kebab case.
 */
function kebabCase(name) {
    return normalise(name).replace(/ /g, '-');
}
exports.kebabCase = kebabCase;
/**
 * Converts an identifier into camelcase.
 */
function camelCase(name) {
    name = normalise(name);
    return name.replace(/ (.)/g, function (m, p1) { return p1.toUpperCase(); });
}
exports.camelCase = camelCase;
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
// Adjacent text nodes happen due to browser bugs, e.g. IE11 splits some text
// nodes if a MutationObserver is enabled somewhere on the page.
function mergeAdjacentTextNodes(node) {
    for (var i = node.childNodes.length - 1; i >= 0; --i) {
        var child = node.childNodes[i];
        var sibling = node.childNodes[i + 1];
        if (child instanceof Text && sibling instanceof Text) {
            child.textContent += sibling.textContent;
            node.removeChild(sibling);
        }
    }
    if (node instanceof Element && node.tagName === 'TEMPLATE') {
        mergeAdjacentTextNodes(node.content);
    }
}
exports.mergeAdjacentTextNodes = mergeAdjacentTextNodes;
exports.templateCache = {
    templates: Object.create(null),
    promises: Object.create(null),
    get: function (url) {
        return exports.templateCache.templates[url] || undefined;
    },
    set: function (url, template) {
        console.assert(typeof template === 'string', 'a template must be a string, received:', template);
        exports.templateCache.templates[url] = template;
    },
    // zone.js ensures the availability of the global Promise constructor.
    load: function (url) {
        if (exports.templateCache.promises[url])
            return exports.templateCache.promises[url];
        if (exports.templateCache.templates[url]) {
            var promise = Promise.resolve(exports.templateCache.templates[url]);
            exports.templateCache.promises[url] = promise;
            return promise;
        }
        return exports.templateCache.promises[url] = new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            function fail() {
                var msg = "failed to load template for url " + url;
                console.warn(msg);
                reject(msg);
            }
            function ok() {
                if (!(xhr.status >= 200) || !(xhr.status <= 299)) {
                    return fail();
                }
                var result = xhr.responseText;
                if (/application\/json/.test(xhr.getResponseHeader('Content-Type'))) {
                    try {
                        var value = JSON.parse(result);
                        if (typeof value === 'string')
                            result = value;
                        else
                            return fail();
                    }
                    catch (err) {
                        return fail();
                    }
                }
                exports.templateCache.set(url, result);
                resolve(result);
            }
            xhr.onabort = xhr.onerror = xhr.ontimeout = fail;
            xhr.onload = ok;
            xhr.open('GET', url, true);
            xhr.send();
        });
    }
};
