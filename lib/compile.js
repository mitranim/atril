'use strict';
var boot_1 = require('./boot');
var tree_1 = require('./tree');
var bindings_1 = require('./bindings');
var view_1 = require('./view');
var utils = require('./utils');
function compileNode(node) {
    if (node instanceof Text) {
        compileTextNode(node);
        return;
    }
    if (node instanceof Element) {
        compileElement(node);
        return;
    }
    // A meta should always be made available, even for comments.
    tree_1.Meta.getOrAddMeta(node);
}
exports.compileNode = compileNode;
function compileTextNode(node) {
    var meta = tree_1.Meta.getOrAddMeta(node);
    if (meta.compiled)
        return;
    if (bindings_1.hasInterpolation(node.textContent)) {
        meta.markDynamic();
        meta.textInterpolation = bindings_1.compileInterpolation(node.textContent);
        // Wipe the text content of the real node to prevent curlies from leaking
        // into the view.
        meta.real.textContent = '';
    }
    meta.compiled = true;
}
function compileElement(element) {
    var meta = tree_1.Meta.getOrAddMeta(element);
    // Allows us to skip recompilation of nodes returned from molds. Molds are
    // expected to explicitly mark their children as immutable. Child molds can't
    // be considered immutable in the compilation sense because parent molds can't
    // trust their output to stay the same.
    if (meta.isDomImmutable && meta.compiled) {
        if (element.tagName !== 'TEMPLATE')
            return;
    }
    // Clean up text nodes.
    utils.pruneTextNodes(element);
    if (!meta.vm && !meta.view) {
        var VM = boot_1.registeredComponents[element.tagName.toLowerCase()];
        if (VM) {
            meta.markDynamic();
            meta.VM = VM;
            meta.view = new view_1.View(VM);
            // view should take care of transclusion
            meta.view.tryToCompile(element);
            return;
        }
    }
    // If the element is a template, here we intentionally do not compile its
    // `.content` in order to give it a chance to modify its "raw" state. This is
    // useful for molds that e.g. compile markdown or highlight code.
    for (var i = 0, ii = element.childNodes.length; i < ii; ++i) {
        var child = element.childNodes[i];
        if (child instanceof Element) {
            var oldChild = child;
            var sibling = child.nextSibling;
            child = unpackTemplatesFromMolds(child);
            if (child !== oldChild)
                element.insertBefore(child, sibling);
            if (child.tagName === 'TEMPLATE') {
                utils.shimTemplateContent(child);
                compileMoldsOnTemplate(child);
            }
            else {
                var meta_1 = tree_1.Meta.getOrAddMeta(child);
                compileAttributeInterpolationsOnRealElement(child, meta_1.real);
                compileAttributeBindingsOnRealElement(child, meta_1.real);
            }
        }
        compileNode(child);
    }
    meta.compiled = true;
}
function unpackTemplatesFromMolds(element) {
    var outerElem = element;
    var atCapacity = element.tagName !== 'TEMPLATE';
    var attributes = [].slice.call(element.attributes, 0);
    if (utils.browserReversesAttributes)
        attributes = attributes.reverse();
    // Unpack in reverse order.
    for (var i = attributes.length - 1; i >= 0; --i) {
        var attr = attributes[i];
        if (utils.looksLikeCustomAttribute(attr.name)) {
            var partialName = utils.customAttributeName(attr.name);
            if (boot_1.registeredMolds[partialName]) {
                if (!atCapacity) {
                    atCapacity = true;
                    continue;
                }
                var template = document.createElement('template');
                utils.shimTemplateContent(template);
                template.setAttribute(attr.name, attr.value);
                element.removeAttribute(attr.name);
                var container = template.content;
                container.appendChild(outerElem);
                outerElem = template;
            }
        }
    }
    return outerElem;
}
function compileMoldsOnTemplate(template) {
    var meta = tree_1.Meta.getOrAddMeta(template);
    if (meta.compiled)
        return;
    for (var i = 0, ii = template.attributes.length; i < ii; ++i) {
        var attr = template.attributes[i];
        // A template is not allowed to have interpolated attributes.
        utils.assert(!bindings_1.hasInterpolation(attr.value), "unexpected interpolation on template:", template);
        // A template is allowed to have only one mold and no custom attributes.
        if (utils.looksLikeCustomAttribute(attr.name)) {
            var partialName = utils.customAttributeName(attr.name);
            // Make sure it's registered.
            var VM = boot_1.registeredAttributes[partialName];
            utils.assert(!!VM, "no registered attribute found for '" + attr.name + "' on template:", template);
            utils.assert(boot_1.registeredMolds[partialName], "unexpected non-mold '" + attr.name + "' on template:", template);
            // No more than one.
            utils.assert(!meta.moldBinding, "unexpected second mold '" + attr.name + "' on template:", template);
            // Register binding.
            meta.markDynamic();
            meta.moldBinding = new bindings_1.AttributeBinding(attr, VM);
        }
    }
}
function compileAttributeBindingsOnRealElement(virtual, real) {
    var meta = tree_1.Meta.getOrAddMeta(virtual);
    // Use the presence of the bindings list as an indicator.
    if (meta.attributeBindings)
        return;
    meta.attributeBindings = [];
    for (var i = 0, ii = real.attributes.length; i < ii; ++i) {
        var attr = real.attributes[i];
        if (utils.looksLikeCustomAttribute(attr.name)) {
            var partialName = utils.customAttributeName(attr.name);
            // Make sure it's registered and not a mold.
            var VM = boot_1.registeredAttributes[partialName];
            utils.assert(!!VM, "no registered custom attribute found for '" + attr.name + "' on element:", real);
            utils.assert(!boot_1.registeredMolds[partialName], "unexpected mold '" + attr.name + "' on element:", real);
            // Register binding.
            if (!meta.dynamic)
                meta.markDynamic();
            meta.attributeBindings.push(new bindings_1.AttributeBinding(attr, VM));
        }
    }
}
exports.compileAttributeBindingsOnRealElement = compileAttributeBindingsOnRealElement;
function compileAttributeInterpolationsOnRealElement(virtual, real) {
    var meta = tree_1.Meta.getOrAddMeta(virtual);
    if (meta.compiled)
        return;
    for (var i = 0, ii = real.attributes.length; i < ii; ++i) {
        var attr = real.attributes[i];
        if (utils.looksLikeCustomAttribute(attr.name))
            continue;
        if (bindings_1.hasInterpolation(attr.value)) {
            if (!meta.attributeInterpolations)
                meta.attributeInterpolations = [];
            if (!meta.dynamic)
                meta.markDynamic();
            meta.attributeInterpolations.push(new bindings_1.AttributeInterpolation(attr));
            // Wipe the interpolation from the attribute to prevent curlies from
            // leaking into the view (e.g. via `placeholder` or anything else that
            // makes attribute content visible).
            attr.value = '';
        }
    }
}
