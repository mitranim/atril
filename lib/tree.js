'use strict';
var compile_1 = require('./compile');
var utils = require('./utils');
var traceKey = typeof Symbol === 'function' ? Symbol('atrilTrace') : utils.randomString();
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
var Trace = (function () {
    function Trace(virtual, real) {
        this.virtual = null;
        this.real = null;
        this.vm = null;
        this.scope = null;
        // A view tracks the progress of asynchronously fetching a view by URL. While
        // it exists (while a template is unavailable), this trace's node won't be
        // phased.
        this.view = null;
        this.compiled = false;
        this.VM = null;
        // Set by a mold as a promise to not modify the node or any of its
        // descendants. Allows us to skip recompilation of entire trees during phases.
        this.isDomImmutable = false;
        // A trace is marked as dynamic if it has any bindings.
        this.dynamic = false;
        // Closest ancestral dynamic trace.
        this.ancestorTrace = null;
        // Descendant dynamic traces.
        this.descendantTraces = null;
        this.textInterpolation = null;
        this.attributeInterpolations = null;
        this.attributeBindings = null;
        this.moldBinding = null;
        // Workaround for an IE10/11 problem where the browser removes non-standard
        // properties from text nodes (instances of Text). The problem is prevented if
        // references to those text nodes are kept _somewhere_ in the JavaScript code.
        // The reference also can't be held by the trace associated with the text node
        // in question, so we keep it on the parent trace to give it a good chance of
        // being automatically garbage collected when this branch is destroyed. This
        // should never be used by our JS code — it exists solely to keep references.
        this.msieChildTextNodes = null;
        this.virtual = virtual;
        if (real) {
            this.real = real;
        }
        else if (!(virtual instanceof Element && virtual.tagName === 'TEMPLATE')) {
            this.real = virtual.cloneNode();
        }
    }
    Trace.prototype.markDynamic = function () {
        utils.assert(!this.ancestorTrace, "unexpected second dynamic registration of trace:", this);
        var trace = getAncestorDynamicTrace(this.virtual);
        if (trace) {
            if (!trace.descendantTraces)
                trace.descendantTraces = [];
            utils.assert(!~trace.descendantTraces.indexOf(this), "unexpected second dynamic registration of trace:", this);
            trace.descendantTraces.push(this);
            this.ancestorTrace = trace;
        }
        this.dynamic = true;
    };
    Trace.prototype.insertScope = function (locals) {
        this.scope = this.scope || Object.create(this.getScope());
        if (locals != null && typeof locals === 'object') {
            for (var key in locals)
                this.scope[key] = locals[key];
        }
        if (!this.dynamic)
            this.markDynamic();
    };
    Trace.prototype.getScope = function () {
        if (this.scope)
            return this.scope;
        var trace = this;
        while (trace = trace.ancestorTrace) {
            if (trace.vm)
                return trace.vm;
            if (trace.scope)
                return trace.scope;
        }
        return null;
    };
    Trace.prototype.destroy = function () {
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
        delete this.virtual[traceKey];
        this.virtual = null;
        this.real = null;
        this.ancestorTrace = null;
    };
    return Trace;
})();
exports.Trace = Trace;
function hasTrace(virtual) {
    return virtual.hasOwnProperty(traceKey);
}
exports.hasTrace = hasTrace;
function getTrace(virtual) {
    if (hasTrace(virtual))
        return virtual[traceKey];
    return null;
}
exports.getTrace = getTrace;
function getOrAddTrace(virtual) {
    if (hasTrace(virtual))
        return virtual[traceKey];
    // IE 10/11 workaround, see State.
    if (virtual instanceof Text && utils.msie) {
        var parentState = getTrace(virtual.parentNode);
        if (!parentState.msieChildTextNodes)
            parentState.msieChildTextNodes = [];
        parentState.msieChildTextNodes.push(virtual);
    }
    virtual[traceKey] = new Trace(virtual);
    return virtual[traceKey];
}
exports.getOrAddTrace = getOrAddTrace;
function addRootTrace(virtual, real) {
    utils.assert(virtual instanceof Element, "unexpected root trace addition to non-element:", virtual);
    utils.assert(real instanceof Element, "unexpected root trace addition to non-element:", virtual);
    var trace = new Trace(virtual, real);
    trace.markDynamic();
    virtual[traceKey] = trace;
    return trace;
}
exports.addRootTrace = addRootTrace;
function getAncestorDynamicTrace(virtual) {
    var trace;
    while (virtual.parentNode) {
        virtual = virtual.parentNode;
        trace = getTrace(virtual);
        if (trace.dynamic)
            return trace;
    }
    return trace || null;
}
// Must follow the sequence: (two elements?) -> init VMs -> phase attributes ->
// phase child nodes.
function phaseElements(virtual, real) {
    var trace = getOrAddTrace(virtual);
    utils.assert(trace.compiled, "expected the trace during a phase to be compiled");
    if (trace.view) {
        // Ignore if view not ready.
        if (trace.view.loading)
            return;
        if (trace.view.failed) {
            // TODO check if we need additional cleanup here.
            return;
        }
        trace.view = null;
        utils.assert(!!trace.VM, 'have trace.view without a trace.VM:', trace);
        // The vm must be created before phasing its child nodes in order to provide
        // the viewmodel.
        trace.vm = Object.create(trace.VM.prototype);
        trace.vm.element = real;
        trace.VM.call(trace.vm);
    }
    // Currently also tries to phase attributes on a root, must fix.
    compileAndPhaseAttributes(virtual, real);
    phaseChildNodes(virtual, real);
    if (trace.vm && typeof trace.vm.onPhase === 'function')
        trace.vm.onPhase();
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
        var trace = getTrace(virtualChild);
        // Put the real child in position.
        if (realChild !== trace.real) {
            real.insertBefore(trace.real, realChild || null);
            realChild = trace.real;
        }
        // Phase and sync contents.
        phaseNodes(virtualChild, realChild);
    }
    while (real.childNodes.length > children.length) {
        real.removeChild(real.lastChild);
    }
}
function phaseTextNodes(virtual, real) {
    var trace = getTrace(virtual);
    if (trace.textInterpolation) {
        var scope = trace.getScope();
        var result = trace.textInterpolation.call(scope, scope);
        // Skip the virtual node update, refresh only the real node content.
        if (real.textContent !== result)
            real.textContent = result;
    }
}
function phaseTemplate(template) {
    var trace = getTrace(template);
    var binding = trace.moldBinding;
    if (!binding)
        return false;
    binding.refreshState(template, trace, trace.getScope());
    return binding.phase();
}
function phaseAndUnpackTemplate(template) {
    var trace = getTrace(template);
    var needsCompilation = !trace.moldBinding || trace.moldBinding.isNew;
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
function compileAndPhaseAttributes(virtual, real) {
    compile_1.compileAttributeBindingsOnRealElement(virtual, real);
    // Phase custom attributes on both children.
    phaseCustomAttributes(virtual, real);
    // Phase and sync static attributes.
    phaseAndSyncAttributeInterpolations(virtual, real);
}
function phaseCustomAttributes(virtual, real) {
    var trace = getTrace(virtual);
    var bindings = trace.attributeBindings;
    if (!bindings)
        return;
    for (var i = 0, ii = bindings.length; i < ii; ++i) {
        var binding = bindings[i];
        binding.refreshState(real, trace, trace.getScope());
        binding.phase();
    }
}
function phaseAndSyncAttributeInterpolations(virtual, real) {
    var trace = getTrace(virtual);
    var bindings = trace.attributeInterpolations;
    if (!bindings)
        return;
    for (var i = 0, ii = bindings.length; i < ii; ++i) {
        var binding = bindings[i];
        var scope = trace.getScope();
        var result = binding.expression.call(scope, scope);
        // Skip updating the virtual node, only refresh the real one.
        if (binding.attr.value !== result)
            binding.attr.value = result;
    }
}
