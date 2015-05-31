'use strict';
'Thou shalt not comment.';
var utils = require('./utils');
require('zone');
var localZone = zone.fork({
    afterTask: function () {
        // zone.js automatically reruns a task after ≈1 s if the task throws. It
        // also hides all exceptions after the first during these retries. For us,
        // if a binding consistently throws during a phase, it causes continuous
        // reflows. To avoid that, we have to capture the exception.
        try {
            reflow();
        }
        catch (err) {
            console.error(err);
        }
    }
});
function bootstrap() {
    localZone.run(function () { });
}
exports.bootstrap = bootstrap;
// Viewmodel of the given element.
exports.vmKey = typeof Symbol === 'function' ? Symbol('atrilVm') : utils.randomString();
// Component container on the given element or text interpolation on the given node.
var bindingKey = typeof Symbol === 'function' ? Symbol('atrilBinding') : utils.randomString();
// Collection of an element's attribute bindings keyed by attribute names.
var bindingStashKey = typeof Symbol === 'function' ? Symbol('atrilBindingStash') : utils.randomString();
// Local scope inheriting from a viewmodel, forked at the given element.
exports.scopeKey = typeof Symbol === 'function' ? Symbol('atrilScope') : utils.randomString();
var registeredComponents = Object.create(null);
var registeredAttributes = Object.create(null);
var registeredDrafts = Object.create(null);
function Component(config) {
    var tagRegex = /^[a-z][a-z-]*[a-z]$/;
    // Type checks.
    console.assert(typeof config.tagName === 'string', "expected a string tagname, got:", config.tagName);
    console.assert(tagRegex.test(config.tagName), "the tagname must match regex " + tagRegex + ", got:", config.tagName);
    return function (VM) {
        console.assert(typeof VM === 'function', "expected a component class, got:", VM);
        var name = config.tagName.toUpperCase();
        console.assert(!registeredComponents[name], "unexpected redefinition of component with tagname " + config.tagName);
        registeredComponents[name] = VM;
    };
}
exports.Component = Component;
function Attribute(config) {
    var nameRegex = /^[a-z][a-z-]*[a-z]$/;
    // Type checks.
    console.assert(typeof config.attributeName === 'string', "expected a string attribute name, got:", config.attributeName);
    console.assert(nameRegex.test(config.attributeName), "the attribute name must match regex " + nameRegex + ", got:", config.attributeName);
    console.assert(!registeredAttributes[config.attributeName], "unexpected redefinition of attribute " + config.attributeName);
    return function (VM) {
        console.assert(typeof VM === 'function', "expected an attribute class, got:", VM);
        registeredAttributes[config.attributeName] = VM;
    };
}
exports.Attribute = Attribute;
function Draft(config) {
    return function (VM) {
        Attribute(config)(VM);
        registeredDrafts[config.attributeName] = true;
    };
}
exports.Draft = Draft;
var reflowScheduled = false;
function scheduleReflow() {
    reflowScheduled = true;
}
exports.scheduleReflow = scheduleReflow;
var reflowStackDepth = 0;
var maxReflowStackDepth = 10;
function reflow() {
    reflowStackDepth++;
    if (reflowStackDepth >= maxReflowStackDepth) {
        throw new Error("reached " + maxReflowStackDepth + " recursive reflow phases, aborting");
    }
    reflowWithUnlimitedStack();
    if (reflowScheduled) {
        reflowScheduled = false;
        reflow();
    }
    reflowStackDepth--;
}
function reflowWithUnlimitedStack(element) {
    if (element === void 0) { element = document.body; }
    console.assert(element instanceof Element, "expected an Element, got:", element);
    var container = element[bindingKey];
    if (container) {
        container.phase();
        return;
    }
    var VM = registeredComponents[element.tagName];
    if (VM) {
        var container_1 = new ComponentContainer(element, VM);
        container_1.instantiate();
        container_1.phase();
        return;
    }
    for (var i = 0, ii = element.childNodes.length; i < ii; ++i) {
        var node = element.childNodes[i];
        if (node instanceof Element)
            reflowWithUnlimitedStack(node);
    }
}
function instantiateIfNecessary(element) {
    if (element[bindingKey])
        return;
    var VM = registeredComponents[element.tagName];
    if (VM)
        new ComponentContainer(element, VM).instantiate();
}
var ComponentContainer = (function () {
    function ComponentContainer(element, VM) {
        // For async templating.
        this.compiled = false;
        this.loadingTemplate = false;
        this.real = element;
        this.VM = VM;
    }
    ComponentContainer.prototype.instantiate = function () {
        this.vm = Object.create(this.VM.prototype);
        // Preassignment.
        this.real[exports.vmKey] = this.vm;
        this.vm.element = this.real;
        this.real[bindingKey] = this;
        // Instantiate the viewmodel.
        this.VM.call(this.vm);
        // Prepare the virtual DOM.
        this.tryToCompile();
    };
    ComponentContainer.prototype.tryToCompile = function () {
        if (this.loadingTemplate)
            return;
        var template = this.VM.template;
        if (typeof template === 'string') {
            this.compileTemplate(template);
            return;
        }
        var url = this.VM.templateUrl;
        if (typeof url === 'string' && url) {
            var template_1 = this.getTemplateFromUrl(url);
            if (typeof template_1 === 'string')
                this.compileTemplate(template_1);
            return;
        }
        this.compileTemplate('');
    };
    ComponentContainer.prototype.compileTemplate = function (template) {
        this.loadingTemplate = false;
        this.compiled = true;
        this.virtual = this.real.cloneNode();
        this.virtual.innerHTML = template;
        compileNode(this.virtual);
    };
    ComponentContainer.prototype.loadTemplateFromPromise = function (promise) {
        var _this = this;
        this.loadingTemplate = true;
        promise
            .then(function (result) {
            _this.loadingTemplate = false;
            if (typeof result === 'string') {
                _this.compileTemplate(result);
                return;
            }
            console.warn('expected a template promise to resolve to a string, got:', result);
            return Promise.reject("expected a template promise to resolve to a string, got: " + result);
        })
            .catch(function (err) {
            _this.loadingTemplate = false;
            _this.phase = function () { };
            return Promise.reject(err);
        });
    };
    ComponentContainer.prototype.getTemplateFromUrl = function (url) {
        var template = utils.templateCache.get(url);
        if (template)
            return template;
        this.loadTemplateFromPromise(utils.templateCache.load(url));
    };
    ComponentContainer.prototype.phase = function () {
        if (!this.compiled)
            this.tryToCompile();
        if (this.compiled)
            this.phaseSync();
    };
    ComponentContainer.prototype.phaseSync = function (virtual, real) {
        if (virtual === void 0) { virtual = this.virtual; }
        if (real === void 0) { real = this.real; }
        // Sanity check.
        console.assert(nodeTypesMatch(virtual, real), "expected nodes with matching types, got", virtual, "and", real);
        if (virtual instanceof Text && real instanceof Text) {
            this.phaseTextNodes(virtual, real);
            return;
        }
        if (virtual instanceof Element) {
            var children = [];
            for (var i_1 = 0, ii_1 = virtual.childNodes.length; i_1 < ii_1; ++i_1) {
                var child = virtual.childNodes[i_1];
                if (child instanceof Element && child.tagName === 'TEMPLATE') {
                    children.push.apply(children, this.phaseAndUnpackTemplate(child));
                }
                else {
                    children.push(child);
                }
            }
            // Compare the children side by side.
            for (var i = 0, ii = children.length; i < ii; ++i) {
                var virtualChild = children[i];
                var realChild = real.childNodes[i];
                // Create a child if there's no similar one in this position.
                if (!realChild || !nodeTypesMatch(virtualChild, realChild)) {
                    realChild = virtualChild.cloneNode();
                }
                if (virtualChild instanceof Element && realChild instanceof Element) {
                    compileCustomAttributesOnElement(realChild);
                    // Phase custom attributes on both children.
                    this.phaseCustomAttributes(virtualChild, realChild);
                    // Phase and sync static attributes.
                    this.phaseAndSyncStaticAttributes(virtualChild, realChild);
                    // Phase and sync contents. If the real child is a custom element
                    // managed by atril, instantiate and phase it instead.
                    instantiateIfNecessary(realChild);
                    var container = realChild[bindingKey];
                    if (container)
                        container.phase();
                    else
                        this.phaseSync(virtualChild, realChild);
                }
                else {
                    this.phaseSync(virtualChild, realChild);
                }
                // Add the element to the DOM if all operations are successful.
                if (real.childNodes[i] !== realChild) {
                    real.insertBefore(realChild, real.childNodes[i] || null);
                }
            }
            // Remove any leftovers.
            while (real.childNodes.length > children.length) {
                real.removeChild(real.lastChild);
            }
        }
        if (real === this.real && typeof this.vm.phase === 'function')
            this.vm.phase();
    };
    ComponentContainer.prototype.phaseTextNodes = function (virtual, real) {
        var expression = virtual[bindingKey];
        if (!expression)
            return;
        var scope = this.scopeAtVirtualNode(virtual);
        var result = expression(scope);
        if (virtual.textContent !== result)
            virtual.textContent = result;
        if (real.textContent !== result)
            real.textContent = result;
    };
    ComponentContainer.prototype.phaseTemplate = function (template) {
        for (var i = 0, ii = template.attributes.length; i < ii; ++i) {
            var attr = template.attributes[i];
            // Attributes like `style` can get automatically removed during phasing.
            if (!attr)
                continue;
            var binding = getBindingForAttribute(template, attr.name);
            if (binding instanceof AttributeBinding) {
                binding.refreshState(template, this.scopeAtVirtualNode(template));
                binding.phase();
            }
        }
    };
    ComponentContainer.prototype.phaseAndUnpackTemplate = function (template) {
        this.phaseTemplate(template);
        compileNode(template);
        var nodes = [];
        for (var i = 0, ii = template.childNodes.length; i < ii; ++i) {
            var child = template.childNodes[i];
            if (child instanceof Element && child.tagName === 'TEMPLATE') {
                nodes.push.apply(nodes, this.phaseAndUnpackTemplate(child));
            }
            else {
                nodes.push(child);
            }
        }
        return nodes;
    };
    ComponentContainer.prototype.phaseCustomAttributes = function (virtual, real) {
        for (var i = 0, ii = real.attributes.length; i < ii; ++i) {
            var attr = real.attributes[i];
            // Attributes like `style` can get automatically removed during phasing.
            if (!attr)
                continue;
            var binding = getBindingForAttribute(real, attr.name);
            if (binding instanceof AttributeBinding) {
                binding.refreshState(real, this.scopeAtVirtualNode(virtual));
                binding.phase();
            }
        }
    };
    ComponentContainer.prototype.phaseAndSyncStaticAttributes = function (virtual, real) {
        for (var i = 0, ii = virtual.attributes.length; i < ii; ++i) {
            var attr = virtual.attributes[i];
            // Ignore custom attributes.
            if (utils.looksLikeCustomAttribute(attr.name))
                continue;
            // Sync static attributes.
            var expression = getBindingForAttribute(virtual, attr.name);
            if (expression instanceof Function) {
                var scope = this.scopeAtVirtualNode(virtual);
                var result = expression.call(scope, scope);
                attr.textContent = result;
                var realAttr = real.attributes.getNamedItem(attr.name);
                if (realAttr)
                    realAttr.textContent = result;
                else
                    real.setAttribute(attr.name, result);
            }
        }
        // We don't remove extraneous real attributes because this would mess with
        // bindings to `style`, `hidden`, etc.
    };
    ComponentContainer.prototype.scopeAtVirtualNode = function (node) {
        while (true) {
            if (node[exports.scopeKey])
                return node[exports.scopeKey];
            if (node === this.virtual)
                return this.vm;
            node = node.parentElement;
        }
    };
    return ComponentContainer;
})();
var AttributeBinding = (function () {
    function AttributeBinding(attribute, VM) {
        this.hint = attribute.name.match(/^[a-z-]+\.(.*)/)[1];
        this.expression = compileExpression(attribute.value);
        this.VM = VM;
    }
    AttributeBinding.prototype.refreshState = function (element, scope) {
        var isNew = !this.vm;
        if (isNew) {
            this.vm = Object.create(this.VM.prototype);
            this.vm.hint = this.hint;
            this.vm.expression = this.expression;
        }
        this.vm.element = element;
        this.vm.scope = scope;
        if (isNew)
            this.VM.call(this.vm);
    };
    AttributeBinding.prototype.phase = function () {
        if (typeof this.vm.phase === 'function')
            this.vm.phase();
    };
    return AttributeBinding;
})();
function nodeTypesMatch(one, other) {
    return one instanceof Comment && other instanceof Comment ||
        one instanceof Text && other instanceof Text ||
        (one instanceof Element && other instanceof Element &&
            one.tagName === other.tagName);
}
function hasInterpolation(text) {
    return /\{\{((?:[^}]|}(?=[^}]))*)\}\}/g.test(text);
}
function compileTextExpression(text) {
    var reg = /\{\{((?:[^}]|}(?=[^}]))*)\}\}/g;
    var result;
    var collection = [];
    var slice = text;
    while (result = reg.exec(slice)) {
        var piece = slice.slice(0, result.index);
        if (piece)
            collection.push(piece);
        slice = slice.slice(result.index).replace(result[0], '');
        collection.push(compileExpression(result[1]));
    }
    if (slice)
        collection.push(slice);
    return function (scope, locals) {
        if (scope == null)
            return '';
        var total = '';
        for (var i = 0, ii = collection.length; i < ii; ++i) {
            var item = collection[i];
            if (typeof item === 'string') {
                total += item;
                continue;
            }
            var result_1 = item.call(scope, scope, locals);
            if (result_1 != null)
                total += result_1;
        }
        return total;
    };
}
// Problems:
// * Provides access to globals.
// * Doesn't assign to missing properties (throws a reference error).
// * Has to be re-interpreted on each call to support locals that don't mess
//   with property assignment in scopes.
function compileExpression(expression) {
    return function (scope, locals) {
        var argList = [];
        var argValues = [];
        if (locals != null && typeof locals === 'object') {
            argList = Object.keys(locals);
            for (var i = 0, ii = argList.length; i < ii; ++i) {
                argValues.push(locals[argList[i]]);
            }
        }
        argValues.push(scope);
        var returnPrefix = ~expression.indexOf(';') ? '' : 'return ';
        var body = "with (arguments[" + (argValues.length - 1) + "]) {\n      return function() {'use strict';\n        " + returnPrefix + expression + "\n      }.call(this);\n    }";
        argList.push(body);
        var func = Function.apply(void 0, argList);
        return func.call.apply(func, [this === window ? scope : this].concat(argValues));
    };
}
exports.compileExpression = compileExpression;
function compileNode(node) {
    if (node instanceof Text) {
        if (!node[bindingKey] && hasInterpolation(node.textContent)) {
            node[bindingKey] = compileTextExpression(node.textContent);
        }
        return;
    }
    if (node instanceof Element) {
        // Patch for an IE11 bug where it splits some text nodes when a
        // MutationObserver is enabled somewhere.
        utils.mergeAdjacentTextNodes(node);
        for (var i = 0, ii = node.childNodes.length; i < ii; ++i) {
            var child = node.childNodes[i];
            if (child instanceof Element) {
                var childElem = child;
                var sibling = childElem.nextSibling;
                childElem = unpackTemplatesFromDrafts(childElem);
                node.insertBefore(childElem, sibling);
                if (childElem.tagName === 'TEMPLATE') {
                    utils.shimTemplateContent(childElem);
                    compileDraftsOnTemplate(childElem);
                }
                else {
                    compileTextAttributesOnElement(childElem);
                }
            }
            compileNode(child);
        }
    }
}
function unpackTemplatesFromDrafts(element) {
    var outerElem = element;
    var atCapacity = element.tagName !== 'TEMPLATE';
    var attributes = [].slice.call(element.attributes);
    // Unpack in reverse order.
    for (var i = attributes.length - 1; i >= 0; --i) {
        var attr = attributes[i];
        if (utils.looksLikeCustomAttribute(attr.name)) {
            var partialName = utils.customAttributeName(attr.name);
            if (registeredDrafts[partialName]) {
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
function compileDraftsOnTemplate(template) {
    var oneDraftAllowed = true;
    for (var i = 0, ii = template.attributes.length; i < ii; ++i) {
        var attr = template.attributes[i];
        if (getBindingForAttribute(template, attr.name))
            continue;
        // A template is not allowed to have interpolated attributes.
        console.assert(!hasInterpolation(attr.value), "unexpected interpolation on template:", template);
        // A template is allowed to have only one draft and no custom attributes.
        if (utils.looksLikeCustomAttribute(attr.name)) {
            var partialName = utils.customAttributeName(attr.name);
            // Make sure it's registered.
            var VM = registeredAttributes[partialName];
            console.assert(!!VM, "no registered attribute found for '" + attr.name + "' on template:", template);
            console.assert(registeredDrafts[partialName], "unexpected non-draft '" + attr.name + "' on template:", template);
            console.assert(oneDraftAllowed, "unexpected second draft '" + attr.name + "' on template:", template);
            oneDraftAllowed = false;
            // Register binding.
            setBindingForAttribute(template, attr.name, new AttributeBinding(attr, VM));
        }
    }
}
// Must be called on a real element.
function compileCustomAttributesOnElement(element) {
    for (var i = 0, ii = element.attributes.length; i < ii; ++i) {
        var attr = element.attributes[i];
        var binding = getBindingForAttribute(element, attr.name);
        if (!binding && utils.looksLikeCustomAttribute(attr.name)) {
            var partialName = utils.customAttributeName(attr.name);
            // Make sure it's registered and not a draft.
            var VM = registeredAttributes[partialName];
            console.assert(!!VM, "no registered custom attribute found for '" + attr.name + "' on element:", element);
            console.assert(!registeredDrafts[partialName], "unexpected draft '" + attr.name + "' on element:", element);
            // Register binding.
            setBindingForAttribute(element, attr.name, new AttributeBinding(attr, VM));
        }
    }
}
function compileTextAttributesOnElement(element) {
    for (var i = 0, ii = element.attributes.length; i < ii; ++i) {
        var attr = element.attributes[i];
        if (utils.looksLikeCustomAttribute(attr.name))
            continue;
        var expression = getBindingForAttribute(element, attr.name);
        if (!expression && hasInterpolation(attr.textContent)) {
            setBindingForAttribute(element, attr.name, compileTextExpression(attr.textContent));
        }
    }
}
function getBindingForAttribute(element, attrName) {
    var stash = element[bindingStashKey];
    if (!stash)
        return null;
    return stash[attrName] || null;
}
/**
 * Stores an attribute binding in a separate store on the element. Attributes
 * appear to be refreshed at arbitrary points in time due to garbage
 * collection, losing bindings, which we want to preserve over the lifetime of
 * an element. Happens consistently in Blink.
 */
function setBindingForAttribute(element, attrName, binding) {
    var stash = element[bindingStashKey];
    if (!stash) {
        stash = Object.create(null);
        element[bindingStashKey] = stash;
    }
    stash[attrName] = binding;
}
