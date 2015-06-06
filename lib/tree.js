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
    function Trace() {
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
    }
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
    };
    return Trace;
})();
exports.Trace = Trace;
function hasTrace(node) {
    return node.hasOwnProperty(traceKey);
}
exports.hasTrace = hasTrace;
function getTrace(node) {
    if (hasTrace(node))
        return node[traceKey];
    return null;
}
exports.getTrace = getTrace;
function getOrAddTrace(node) {
    if (hasTrace(node))
        return node[traceKey];
    // IE 10/11 workaround, see State.
    if (node instanceof Text && utils.msie) {
        var parentState = getTrace(node.parentNode);
        if (!parentState.msieChildTextNodes)
            parentState.msieChildTextNodes = [];
        parentState.msieChildTextNodes.push(node);
    }
    node[traceKey] = new Trace();
    return node[traceKey];
}
exports.getOrAddTrace = getOrAddTrace;
function getScope(virtual) {
    var trace = getTrace(virtual);
    if (trace.scope)
        return trace.scope;
    var node = virtual;
    while (node = node.parentNode) {
        var trace_1 = getTrace(node);
        if (trace_1.vm)
            return trace_1.vm;
        if (trace_1.scope)
            return trace_1.scope;
    }
    return null;
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
        // Try to reuse a child or create a new one.
        if (!realChild || trace.real !== realChild) {
            if (!trace.real) {
                trace.real = virtualChild.cloneNode();
            }
            real.insertBefore(trace.real, realChild);
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
        var scope = getScope(virtual);
        var result = trace.textInterpolation.call(scope, scope);
        // Skip the virtual node update, refresh only the real node content.
        // if (virtual.textContent !== result) virtual.textContent = result;
        if (real.textContent !== result)
            real.textContent = result;
    }
}
function phaseTemplate(template) {
    var trace = getTrace(template);
    var binding = trace.moldBinding;
    if (!binding)
        return false;
    binding.refreshState(template, trace, getScope(template));
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
        binding.refreshState(real, trace, getScope(virtual));
        binding.phase();
    }
}
function phaseAndSyncAttributeInterpolations(virtual, real) {
    var bindings = getTrace(virtual).attributeInterpolations;
    if (!bindings)
        return;
    for (var i = 0, ii = bindings.length; i < ii; ++i) {
        var binding = bindings[i];
        var scope = getScope(virtual);
        var result = binding.expression.call(scope, scope);
        // Skip updating the virtual node, only refresh the real one.
        // if (virtual.getAttribute(binding.name) !== result) {
        //   virtual.setAttribute(binding.name, result);
        // }
        if (real.getAttribute(binding.name) !== result) {
            real.setAttribute(binding.name, result);
        }
    }
}
