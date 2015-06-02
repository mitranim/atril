var boot_1 = require('./boot');
var tree_1 = require('./tree');
var bindings_1 = require('./bindings');
var view_1 = require('./view');
var utils = require('./utils');
function compileNode(node) {
    var state = tree_1.getOrAddState(node);
    if (state.isDomImmutable && state.compiled)
        return;
    if (node instanceof Text) {
        if (bindings_1.hasInterpolation(node.textContent)) {
            state.textInterpolation = bindings_1.compileTextExpression(node.textContent);
        }
        state.compiled = true;
        return;
    }
    if (node instanceof Element) {
        // Patch for an IE11 bug where it splits some text nodes when a
        // MutationObserver is enabled somewhere.
        utils.mergeAdjacentTextNodes(node);
        if (!state.vm && !state.view) {
            var VM = boot_1.registeredComponents[node.tagName.toLowerCase()];
            if (VM) {
                state.VM = VM;
                state.view = new view_1.View(VM);
                // view should take care of transclusion
                state.view.tryToCompile(node);
                return;
            }
        }
        for (var i = 0, ii = node.childNodes.length; i < ii; ++i) {
            var child = node.childNodes[i];
            if (child instanceof Element) {
                var childElem = child;
                var sibling = childElem.nextSibling;
                childElem = unpackTemplatesFromMolds(childElem);
                if (childElem !== child)
                    node.insertBefore(childElem, sibling);
                if (childElem.tagName === 'TEMPLATE') {
                    utils.shimTemplateContent(childElem);
                    compileMoldsOnTemplate(childElem);
                }
                else {
                    compileAttributeInterpolationsOnElement(childElem);
                }
            }
            compileNode(child);
        }
    }
    state.compiled = true;
}
exports.compileNode = compileNode;
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
exports.unpackTemplatesFromMolds = unpackTemplatesFromMolds;
function compileMoldsOnTemplate(template) {
    if (tree_1.hasState(template))
        return;
    var state = tree_1.getOrAddState(template);
    for (var i = 0, ii = template.attributes.length; i < ii; ++i) {
        var attr = template.attributes[i];
        // A template is not allowed to have interpolated attributes.
        console.assert(!bindings_1.hasInterpolation(attr.value), "unexpected interpolation on template:", template);
        // A template is allowed to have only one mold and no custom attributes.
        if (utils.looksLikeCustomAttribute(attr.name)) {
            var partialName = utils.customAttributeName(attr.name);
            // Make sure it's registered.
            var VM = boot_1.registeredAttributes[partialName];
            console.assert(!!VM, "no registered attribute found for '" + attr.name + "' on template:", template);
            console.assert(boot_1.registeredMolds[partialName], "unexpected non-mold '" + attr.name + "' on template:", template);
            // No more than one.
            console.assert(!state.moldBinding, "unexpected second mold '" + attr.name + "' on template:", template);
            // Register binding.
            state.moldBinding = new bindings_1.AttributeBinding(attr, VM);
        }
    }
}
exports.compileMoldsOnTemplate = compileMoldsOnTemplate;
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
            console.assert(!!VM, "no registered custom attribute found for '" + attr.name + "' on element:", real);
            console.assert(!boot_1.registeredMolds[partialName], "unexpected mold '" + attr.name + "' on element:", real);
            // Register binding.
            state.attributeBindings.push(new bindings_1.AttributeBinding(attr, VM));
        }
    }
}
exports.compileAttributeBindingsOnRealElement = compileAttributeBindingsOnRealElement;
function compileAttributeInterpolationsOnElement(element) {
    if (tree_1.hasState(element))
        return;
    var state = tree_1.getOrAddState(element);
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
exports.compileAttributeInterpolationsOnElement = compileAttributeInterpolationsOnElement;
