var compile_1 = require('./compile');
var utils = require('./utils');
var stateKey = typeof Symbol === 'function' ? Symbol('atrilState') : utils.randomString();
exports.roots = [];
// A Root is a start of a virtual DOM hierarchy. It may be any element.
// Doesn't have to have a viewmodel.
var Root = (function () {
    function Root() {
        this.virtual = null;
        this.real = null;
    }
    return Root;
})();
exports.Root = Root;
// A State belongs to a virtual node and stores all of our private data relevant
// to that node. Each node in the virtual DOM receives a State either during
// bootstrap or during compilation.
var State = (function () {
    function State() {
        this.real = null;
        this.vm = null;
        this.scope = null;
        // A view tracks the progress of asynchronously fetching a view by URL. While
        // it exists (while a template is unavailable), this state's node won't be
        // phased.
        this.view = null;
        this.compiled = false;
        this.VM = null;
        // Set by a mold as a promise to not modify the node or any of its
        // descendants. Allows us to skip recompilation of entire trees during phases.
        this.isDomImmutable = false;
        this.textInterpolation = null;
        this.attributeInterpolations = null;
        this.attributeBindings = null;
        this.moldBinding = null;
    }
    State.prototype.destroy = function () {
        if (this.moldBinding)
            this.moldBinding.destroy();
        if (this.attributeBindings) {
            for (var i = 0, ii = this.attributeBindings.length; i < ii; ++i) {
                this.attributeBindings[i].destroy();
            }
        }
        if (this.vm && typeof this.vm.onDestroy === 'function') {
            this.vm.onDestroy();
        }
    };
    return State;
})();
exports.State = State;
function hasState(node) {
    return node.hasOwnProperty(stateKey);
}
exports.hasState = hasState;
function getState(node) {
    if (hasState(node))
        return node[stateKey];
    return null;
}
exports.getState = getState;
function getOrAddState(node) {
    if (hasState(node))
        return node[stateKey];
    node[stateKey] = new State();
    return node[stateKey];
}
exports.getOrAddState = getOrAddState;
function getScope(virtual) {
    var state = getState(virtual);
    if (state.scope)
        return state.scope;
    while (virtual = virtual.parentNode) {
        var state_1 = getState(virtual);
        if (state_1.scope)
            return state_1.scope;
        if (state_1.vm)
            return state_1.vm;
    }
    return null;
}
function phaseElements(virtual, real) {
    var state = getOrAddState(virtual);
    console.assert(state.compiled, "expected the state during a phase to be compiled");
    if (state.view) {
        // Ignore if view not ready. ToDo check if we need additional cleanup if failed.
        if (state.view.loading)
            return;
        if (state.view.failed) {
            // TODO check if we need additional cleanup here.
            return;
        }
        state.view = null;
        console.assert(!!state.VM, 'have state.view without a state.VM:', state);
        // The vm must be created before phasing its child nodes in order to provide
        // the viewmodel.
        state.vm = Object.create(state.VM.prototype);
        state.vm.element = real;
        state.VM.call(state.vm);
    }
    phaseChildNodes(virtual, real);
    if (state.vm && typeof state.vm.onPhase === 'function')
        state.vm.onPhase();
}
exports.phaseElements = phaseElements;
function phaseNodes(virtual, real) {
    if (virtual instanceof Text && real instanceof Text) {
        phaseTextNodes(virtual, real);
        return;
    }
    if (virtual instanceof Element && real instanceof Element) {
        phaseElements(virtual, real);
        return;
    }
}
function phaseChildNodes(virtual, real) {
    var children = [];
    for (var i_1 = 0, ii_1 = virtual.childNodes.length; i_1 < ii_1; ++i_1) {
        var child = virtual.childNodes[i_1];
        if (child instanceof Element && child.tagName === 'TEMPLATE') {
            children.push.apply(children, phaseAndUnpackTemplate(child));
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
        if (!realChild || state.real !== realChild) {
            if (!state.real) {
                state.real = virtualChild.cloneNode();
            }
            real.insertBefore(state.real, realChild);
            realChild = state.real;
        }
        if (virtualChild instanceof Element && realChild instanceof Element) {
            compile_1.compileAttributeBindingsOnRealElement(virtualChild, realChild);
            // Phase custom attributes on both children.
            phaseCustomAttributes(virtualChild, realChild);
            // Phase and sync static attributes.
            phaseAndSyncAttributeInterpolations(virtualChild, realChild);
        }
        // Phase and sync contents.
        phaseNodes(virtualChild, realChild);
    }
    // Remove any leftovers.
    while (real.childNodes.length > children.length) {
        real.removeChild(real.lastChild);
    }
}
function phaseTextNodes(virtual, real) {
    var state = getState(virtual);
    if (state.textInterpolation) {
        var scope = getScope(virtual);
        var result = state.textInterpolation.call(scope, scope);
        if (virtual.textContent !== result)
            virtual.textContent = result;
        if (real.textContent !== result)
            real.textContent = result;
    }
}
function phaseTemplate(template) {
    var state = getState(template);
    var binding = state.moldBinding;
    binding.refreshState(template, state, getScope(template));
    return binding.phase();
}
function phaseAndUnpackTemplate(template) {
    var needsCompilation = getState(template).moldBinding.isNew;
    if (phaseTemplate(template))
        needsCompilation = true;
    if (needsCompilation)
        compile_1.compileNode(template);
    var nodes = [];
    for (var i = 0, ii = template.childNodes.length; i < ii; ++i) {
        var child = template.childNodes[i];
        if (child instanceof Element && child.tagName === 'TEMPLATE') {
            nodes.push.apply(nodes, phaseAndUnpackTemplate(child));
        }
        else {
            nodes.push(child);
        }
    }
    return nodes;
}
function phaseCustomAttributes(virtual, real) {
    var state = getState(virtual);
    var bindings = state.attributeBindings;
    if (!bindings)
        return;
    for (var i = 0, ii = bindings.length; i < ii; ++i) {
        var binding = bindings[i];
        binding.refreshState(real, state, getScope(virtual));
        binding.phase();
    }
}
function phaseAndSyncAttributeInterpolations(virtual, real) {
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
}
