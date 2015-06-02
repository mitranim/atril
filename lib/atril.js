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
var registeredComponents = Object.create(null);
var registeredAttributes = Object.create(null);
var registeredMolds = Object.create(null);
var stateKey = typeof Symbol === 'function' ? Symbol('atrilState') : utils.randomString();
var roots = [];
var Root = (function () {
    function Root() {
    }
    return Root;
})();
function bootstrap() {
    localZone.run(function bootstrap(element) {
        if (element === void 0) { element = document.body; }
        var VM = registeredComponents[element.tagName.toLowerCase()];
        if (VM) {
            // Don't register components twice.
            for (var i = 0, ii = roots.length; i < ii; ++i) {
                var root_1 = roots[i];
                if (root_1.real === element)
                    return;
            }
            var root = new Root();
            root.virtual = document.createElement(element.tagName);
            root.real = element;
            // This is where we'll need to pass additional descendants when
            // implementing transclusion. Skipping that for now.
            compileNode(root.virtual);
            var state = getState(root.virtual);
            state.container.phase(root.virtual, root.real);
            roots.push(root);
            return;
        }
        for (var i = 0, ii = element.childNodes.length; i < ii; ++i) {
            var node = element.childNodes[i];
            if (node instanceof Element)
                bootstrap(node);
        }
    });
}
exports.bootstrap = bootstrap;
function Component(config) {
    var tagRegex = /^[a-z][a-z-]*[a-z]$/;
    // Type checks.
    console.assert(typeof config.tagName === 'string', "expected a string tagname, got:", config.tagName);
    console.assert(tagRegex.test(config.tagName), "the tagname must match regex " + tagRegex + ", got:", config.tagName);
    return function (VM) {
        console.assert(typeof VM === 'function', "expected a component class, got:", VM);
        console.assert(!registeredComponents[config.tagName], "unexpected redefinition of component with tagname " + config.tagName);
        registeredComponents[config.tagName] = VM;
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
function Mold(config) {
    return function (VM) {
        Attribute(config)(VM);
        registeredMolds[config.attributeName] = true;
    };
}
exports.Mold = Mold;
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
function reflowWithUnlimitedStack() {
    for (var i = 0, ii = roots.length; i < ii; ++i) {
        var root = roots[i];
        if (!root.real.parentNode) {
            // ToDo run a destroy phase here, for memory cleanup etc.
            destroy(root.virtual, root.real);
            delete root.virtual;
            delete root.real;
            roots.splice(i, 1);
            continue;
        }
        getState(root.virtual).container.phase(root.virtual, root.real);
    }
}
function destroy(virtual, real) {
    var state = getState(virtual);
    if (state)
        for (var key in state)
            delete state[key];
    delete virtual[stateKey];
}
var ComponentContainer = (function () {
    function ComponentContainer(virtual, VM) {
        // For async templating.
        this.compiled = false;
        this.loadingTemplate = false;
        this.VM = VM;
        this.vm = Object.create(VM.prototype);
        // Preassignment.
        getOrAddState(virtual).container = this;
        // Instantiate the viewmodel.
        VM.call(this.vm);
        // Prepare the virtual DOM.
        this.tryToCompile(virtual);
    }
    ComponentContainer.prototype.tryToCompile = function (virtual) {
        if (this.loadingTemplate)
            return;
        var template = this.VM.template;
        if (typeof template === 'string') {
            this.compileTemplate(template, virtual);
            return;
        }
        var url = this.VM.templateUrl;
        if (typeof url === 'string' && url) {
            var template_1 = this.getTemplateFromUrl(url, virtual);
            if (typeof template_1 === 'string')
                this.compileTemplate(template_1, virtual);
            return;
        }
        this.compileTemplate('', virtual);
    };
    ComponentContainer.prototype.compileTemplate = function (template, virtual) {
        this.loadingTemplate = false;
        this.compiled = true;
        virtual.innerHTML = template;
        compileNode(virtual);
    };
    ComponentContainer.prototype.loadTemplateFromPromise = function (promise, virtual) {
        var _this = this;
        this.loadingTemplate = true;
        promise
            .then(function (result) {
            _this.loadingTemplate = false;
            if (typeof result === 'string') {
                _this.compileTemplate(result, virtual);
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
    ComponentContainer.prototype.getTemplateFromUrl = function (url, virtual) {
        var template = utils.templateCache.get(url);
        if (template)
            return template;
        this.loadTemplateFromPromise(utils.templateCache.load(url), virtual);
    };
    ComponentContainer.prototype.phase = function (virtual, real) {
        if (!this.compiled)
            this.tryToCompile(virtual);
        if (this.compiled) {
            this.phaseSync(virtual, real);
            this.vm.element = real;
            if (typeof this.vm.onPhase === 'function')
                this.vm.onPhase();
        }
    };
    ComponentContainer.prototype.phaseSync = function (virtual, real) {
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
                var state = getState(virtualChild);
                // Try to reuse a child or create a new one.
                if (!realChild || state.realNode !== realChild) {
                    if (!state.realNode) {
                        state.realNode = virtualChild.cloneNode();
                    }
                    real.insertBefore(state.realNode, realChild);
                    realChild = state.realNode;
                }
                if (virtualChild instanceof Element && realChild instanceof Element) {
                    compileAttributeBindingsOnRealElement(virtualChild, realChild);
                    // Phase custom attributes on both children.
                    this.phaseCustomAttributes(virtualChild, realChild);
                    // Phase and sync static attributes.
                    this.phaseAndSyncAttributeInterpolations(virtualChild, realChild);
                    // Phase and sync contents. If the real child is a custom element
                    // managed by atril, let it phase itself.
                    if (state.container)
                        state.container.phase(virtualChild, realChild);
                    else
                        this.phaseSync(virtualChild, realChild);
                }
                else {
                    this.phaseSync(virtualChild, realChild);
                }
            }
            // Remove any leftovers.
            while (real.childNodes.length > children.length) {
                real.removeChild(real.lastChild);
            }
        }
    };
    ComponentContainer.prototype.phaseTextNodes = function (virtual, real) {
        var state = getState(virtual);
        if (state.textInterpolation) {
            var scope = getScope(virtual);
            var result = state.textInterpolation.call(scope, scope);
            if (virtual.textContent !== result)
                virtual.textContent = result;
            if (real.textContent !== result)
                real.textContent = result;
        }
    };
    ComponentContainer.prototype.phaseTemplate = function (template) {
        var state = getState(template);
        var binding = state.moldBinding;
        binding.refreshState(template, state, getScope(template));
        return binding.phase();
    };
    ComponentContainer.prototype.phaseAndUnpackTemplate = function (template) {
        var needsCompilation = getState(template).moldBinding.isNew;
        if (this.phaseTemplate(template))
            needsCompilation = true;
        if (needsCompilation)
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
        var state = getState(virtual);
        var bindings = state.attributeBindings;
        if (!bindings)
            return;
        for (var i = 0, ii = bindings.length; i < ii; ++i) {
            var binding = bindings[i];
            binding.refreshState(real, state, getScope(virtual));
            binding.phase();
        }
    };
    ComponentContainer.prototype.phaseAndSyncAttributeInterpolations = function (virtual, real) {
        var bindings = getState(virtual).attributeInterpolations;
        if (!bindings)
            return;
        for (var i = 0, ii = bindings.length; i < ii; ++i) {
            var binding = bindings[i];
            var scope = getScope(virtual);
            var result = binding.expression.call(scope, scope);
            // Shouldn't bother syncing to virtual. Or maybe move this code elsewhere.
            if (virtual.getAttribute(binding.name) !== result) {
                virtual.setAttribute(binding.name, result);
            }
            if (real.getAttribute(binding.name) !== result) {
                real.setAttribute(binding.name, result);
            }
        }
    };
    return ComponentContainer;
})();
function compileNode(node) {
    var state = getOrAddState(node);
    if (node instanceof Text) {
        if (hasInterpolation(node.textContent)) {
            state.textInterpolation = compileTextExpression(node.textContent);
        }
        return;
    }
    if (node instanceof Element) {
        // Patch for an IE11 bug where it splits some text nodes when a
        // MutationObserver is enabled somewhere.
        utils.mergeAdjacentTextNodes(node);
        if (!state.container) {
            var VM = registeredComponents[node.tagName.toLowerCase()];
            if (VM) {
                state.container = new ComponentContainer(node, VM);
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
            if (registeredMolds[partialName]) {
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
    if (hasState(template))
        return;
    var state = getOrAddState(template);
    for (var i = 0, ii = template.attributes.length; i < ii; ++i) {
        var attr = template.attributes[i];
        // A template is not allowed to have interpolated attributes.
        console.assert(!hasInterpolation(attr.value), "unexpected interpolation on template:", template);
        // A template is allowed to have only one mold and no custom attributes.
        if (utils.looksLikeCustomAttribute(attr.name)) {
            var partialName = utils.customAttributeName(attr.name);
            // Make sure it's registered.
            var VM = registeredAttributes[partialName];
            console.assert(!!VM, "no registered attribute found for '" + attr.name + "' on template:", template);
            console.assert(registeredMolds[partialName], "unexpected non-mold '" + attr.name + "' on template:", template);
            // No more than one.
            console.assert(!state.moldBinding, "unexpected second mold '" + attr.name + "' on template:", template);
            // Register binding.
            state.moldBinding = new AttributeBinding(attr, VM);
        }
    }
}
function compileAttributeBindingsOnRealElement(virtual, real) {
    var state = getOrAddState(virtual);
    // Use the presence of the bindings list as an indicator.
    if (state.attributeBindings)
        return;
    state.attributeBindings = [];
    for (var i = 0, ii = real.attributes.length; i < ii; ++i) {
        var attr = real.attributes[i];
        if (utils.looksLikeCustomAttribute(attr.name)) {
            var partialName = utils.customAttributeName(attr.name);
            // Make sure it's registered and not a mold.
            var VM = registeredAttributes[partialName];
            console.assert(!!VM, "no registered custom attribute found for '" + attr.name + "' on element:", real);
            console.assert(!registeredMolds[partialName], "unexpected mold '" + attr.name + "' on element:", real);
            // Register binding.
            state.attributeBindings.push(new AttributeBinding(attr, VM));
        }
    }
}
function compileAttributeInterpolationsOnElement(element) {
    if (hasState(element))
        return;
    var state = getOrAddState(element);
    for (var i = 0, ii = element.attributes.length; i < ii; ++i) {
        var attr = element.attributes[i];
        if (utils.looksLikeCustomAttribute(attr.name))
            continue;
        if (hasInterpolation(attr.textContent)) {
            if (!state.attributeInterpolations)
                state.attributeInterpolations = [];
            state.attributeInterpolations.push(new AttributeInterpolation(attr));
        }
    }
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
exports.compileTextExpression = compileTextExpression;
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
function hasState(node) {
    return node.hasOwnProperty(stateKey);
}
function getState(node) {
    if (hasState(node))
        return node[stateKey];
    return null;
}
function getOrAddState(node) {
    if (hasState(node))
        return node[stateKey];
    node[stateKey] = new State();
    return node[stateKey];
}
exports.getOrAddState = getOrAddState;
var State = (function () {
    function State() {
        this.realNode = null;
        this.scope = null;
        this.container = null;
        this.textInterpolation = null;
        this.attributeInterpolations = null;
        this.attributeBindings = null;
        this.moldBinding = null;
    }
    return State;
})();
var AttributeInterpolation = (function () {
    function AttributeInterpolation(attr) {
        this.name = attr.name;
        this.value = attr.value;
        this.expression = compileTextExpression(attr.textContent);
    }
    return AttributeInterpolation;
})();
var AttributeBinding = (function () {
    function AttributeBinding(attr, VM) {
        this.name = attr.name;
        this.value = attr.value;
        this.hint = attr.name.match(/^[a-z-]+\.(.*)/)[1];
        this.expression = compileExpression(attr.value);
        this.VM = VM;
    }
    AttributeBinding.prototype.refreshState = function (element, state, scope) {
        var isNew = this.isNew;
        if (isNew) {
            this.vm = Object.create(this.VM.prototype);
            this.vm.hint = this.hint;
            this.vm.expression = this.expression;
        }
        this.vm.element = element;
        this.vm.scope = scope;
        this.vm.component = state.container ? state.container.vm : null;
        if (isNew)
            this.VM.call(this.vm);
    };
    AttributeBinding.prototype.phase = function () {
        if (typeof this.vm.onPhase === 'function') {
            return this.vm.onPhase(), true;
        }
        return false;
    };
    Object.defineProperty(AttributeBinding.prototype, "isNew", {
        get: function () { return !this.vm; },
        enumerable: true,
        configurable: true
    });
    return AttributeBinding;
})();
// messy, fix
function getScope(virtual) {
    var state = getState(virtual);
    if (state.scope)
        return state.scope;
    if (virtual.parentNode) {
        var parentState = getState(virtual.parentNode);
        if (parentState.container)
            return parentState.container.vm;
        return getScope(virtual.parentNode);
    }
    if (state.container)
        return state.container.vm;
    return null;
}
