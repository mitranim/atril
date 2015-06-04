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
    // A state should always be made available, even for comments.
    tree_1.getOrAddState(node);
}
exports.compileNode = compileNode;
function compileTextNode(node) {
    var state = tree_1.getOrAddState(node);
    if (state.isDomImmutable && state.compiled)
        return;
    if (bindings_1.hasInterpolation(node.textContent)) {
        state.textInterpolation = bindings_1.compileTextExpression(node.textContent);
        // Erase the existing text content to prevent curlies from leaking into the
        // view.
        node.textContent = '';
    }
    state.compiled = true;
}
function compileElement(element) {
    var state = tree_1.getOrAddState(element);
    // Allows us to skip recompilation of nodes returned from molds. Molds are
    // expected to explicitly mark their children as immutable. Child molds can't
    // be considered immutable in the compilation sense because parent molds can't
    // trust their output to stay the same.
    if (state.isDomImmutable && state.compiled) {
        if (element.tagName !== 'TEMPLATE')
            return;
    }
    // Clean up text nodes.
    utils.pruneTextNodes(element);
    if (!state.vm && !state.view) {
        var VM = boot_1.registeredComponents[element.tagName.toLowerCase()];
        if (VM) {
            state.VM = VM;
            state.view = new view_1.View(VM);
            // view should take care of transclusion
            state.view.tryToCompile(element);
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
                compileAttributeInterpolationsOnElement(child);
            }
        }
        compileNode(child);
    }
    state.compiled = true;
}
function unpackTemplatesFromMolds(element) {
    var outerElem = element;
    var atCapacity = element.tagName !== 'TEMPLATE';
    var attributes = [].slice.call(element.attributes);
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
    var state = tree_1.getOrAddState(template);
    if (state.compiled)
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
            utils.assert(!state.moldBinding, "unexpected second mold '" + attr.name + "' on template:", template);
            // Register binding.
            state.moldBinding = new bindings_1.AttributeBinding(attr, VM);
        }
    }
}
function compileAttributeBindingsOnRealElement(virtual, real) {
    var state = tree_1.getOrAddState(virtual);
    // Use the presence of the bindings list as an indicator.
    if (state.attributeBindings)
        return;
    state.attributeBindings = [];
    for (var i = 0, ii = real.attributes.length; i < ii; ++i) {
        var attr = real.attributes[i];
        if (utils.looksLikeCustomAttribute(attr.name)) {
            var partialName = utils.customAttributeName(attr.name);
            // Make sure it's registered and not a mold.
            var VM = boot_1.registeredAttributes[partialName];
            utils.assert(!!VM, "no registered custom attribute found for '" + attr.name + "' on element:", real);
            utils.assert(!boot_1.registeredMolds[partialName], "unexpected mold '" + attr.name + "' on element:", real);
            // Register binding.
            state.attributeBindings.push(new bindings_1.AttributeBinding(attr, VM));
        }
    }
}
exports.compileAttributeBindingsOnRealElement = compileAttributeBindingsOnRealElement;
function compileAttributeInterpolationsOnElement(element) {
    var state = tree_1.getOrAddState(element);
    if (state.compiled)
        return;
    for (var i = 0, ii = element.attributes.length; i < ii; ++i) {
        var attr = element.attributes[i];
        if (utils.looksLikeCustomAttribute(attr.name))
            continue;
        if (bindings_1.hasInterpolation(attr.textContent)) {
            if (!state.attributeInterpolations)
                state.attributeInterpolations = [];
            state.attributeInterpolations.push(new bindings_1.AttributeInterpolation(attr));
        }
    }
}
