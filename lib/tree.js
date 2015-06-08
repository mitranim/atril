'use strict';
var compile_1 = require('./compile');
var utils = require('./utils');
var traceKey = typeof Symbol === 'function' ? Symbol('atrilTrace') : utils.randomString();
exports.roots = [];
var neutralZone = zone.fork();
var queue = {
    traces: [],
    plan: function (trace) {
        if (!~queue.traces.indexOf(trace))
            queue.traces.push(trace);
    },
    flush: function (timestamp) {
        while (queue.traces.length) {
            var trace = queue.traces.shift();
            utils.assert(trace.virtual instanceof Element && trace.virtual.tagName !== 'TEMPLATE', "unexpected non-Element trace in queue:", trace.virtual);
            syncChildNodes(trace.virtual, trace.real);
        }
    }
};
function flushQueue() {
    neutralZone.run(function () {
        window.requestAnimationFrame(queue.flush);
    });
}
exports.flushQueue = flushQueue;
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
        this.VM = null;
        this.scope = null;
        // A view tracks the progress of asynchronously fetching a view by URL. While
        // it exists (while a template is unavailable), this trace's node won't be
        // phased.
        this.view = null;
        // Allows to skip compilation on reflow.
        this.compiled = false;
        // Allows to skip render on reflow.
        this.synced = false;
        // Set by a mold as a promise to not modify the node or any of its
        // descendants. Allows us to skip recompilation of entire trees during phases.
        this.isDomImmutable = false;
        // A trace is marked as dynamic if it has any bindings.
        this.dynamic = false;
        // Closest ancestral dynamic trace.
        this.dynamicAncestor = null;
        // Descendant dynamic traces.
        this.dynamicDescendants = null;
        // True when the trace belongs to a root element.
        this.isRoot = false;
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
        // Repeated dynamic registration happens when compiling components with
        // bindings on them.
        if (this.dynamic)
            return;
        var trace = Trace.getDynamicAncestor(this.virtual);
        if (trace) {
            if (!trace.dynamicDescendants)
                trace.dynamicDescendants = [];
            utils.assert(!~trace.dynamicDescendants.indexOf(this), "unexpected second dynamic registration of trace:", this);
            trace.dynamicDescendants.push(this);
            this.dynamicAncestor = trace;
        }
        this.dynamic = true;
    };
    Trace.prototype.insertScope = function (locals) {
        // Insert into the chain.
        if (!this.dynamic)
            this.markDynamic();
        this.scope = this.scope || Object.create(this.getScope());
        if (locals != null && typeof locals === 'object') {
            for (var key in locals)
                this.scope[key] = locals[key];
        }
    };
    Trace.prototype.getScope = function () {
        if (this.scope)
            return this.scope;
        var trace = this;
        while (trace = trace.dynamicAncestor) {
            if (trace.vm)
                return trace.vm;
            if (trace.scope)
                return trace.scope;
        }
        return null;
    };
    // Must follow the sequence: (two elements?) -> init VMs -> phase attributes
    // -> phase child nodes.
    Trace.prototype.phase = function () {
        utils.assert(this.dynamic, "unexpected phase() call on a non-dynamic trace:", this);
        if (this.virtual instanceof Text) {
            if (this.textInterpolation)
                this.phaseTextInterpolation();
        }
        if (this.virtual instanceof Element) {
            if (this.view) {
                // Ignore if view not ready.
                if (this.view.loading)
                    return;
                if (this.view.failed) {
                    // TODO check if we need additional cleanup here.
                    return;
                }
                this.view = null;
                // The vm must be created before phasing its child nodes in order to provide
                // the viewmodel.
                this.vm = Object.create(this.VM.prototype);
                this.vm.element = this.real;
                this.VM.call(this.vm);
            }
            // Only phase attributes and molds on elements that belong to other
            // elements. This skips roots and elements cached but unused by a mold.
            if (this.virtual.parentNode instanceof Element) {
                if (this.virtual.tagName === 'TEMPLATE')
                    this.phaseMold();
                else {
                    if (this.attributeInterpolations)
                        this.phaseAttributeInterpolations();
                    if (this.attributeBindings)
                        this.phaseAttributeBindings();
                }
            }
            if (this.isRoot || this.virtual.parentNode instanceof Element) {
                if (this.dynamicDescendants) {
                    for (var _i = 0, _a = this.dynamicDescendants; _i < _a.length; _i++) {
                        var trace = _a[_i];
                        trace.phase();
                    }
                }
            }
            if (this.virtual.tagName !== 'TEMPLATE') {
                if (!this.synced)
                    queue.plan(this);
            }
            this.synced = true;
        }
        if (this.vm && typeof this.vm.onPhase === 'function')
            this.vm.onPhase();
    };
    Trace.prototype.phaseTextInterpolation = function () {
        var result = this.textInterpolation.call(this.real, this.getScope());
        if (this.real.textContent !== result)
            this.real.textContent = result;
    };
    Trace.prototype.phaseAttributeInterpolations = function () {
        var scope = this.getScope();
        for (var _i = 0, _a = this.attributeInterpolations; _i < _a.length; _i++) {
            var binding = _a[_i];
            var result = binding.expression.call(this.real, scope);
            if (binding.attr.value !== result)
                binding.attr.value = result;
        }
    };
    Trace.prototype.phaseAttributeBindings = function () {
        if (!this.attributeBindings.length)
            return;
        var scope = this.getScope();
        for (var _i = 0, _a = this.attributeBindings; _i < _a.length; _i++) {
            var binding = _a[_i];
            binding.refreshState(this.real, this);
            binding.phase();
        }
    };
    Trace.prototype.phaseMold = function () {
        var template = this.virtual;
        // Whether the mold needs recompilation and resync into the live DOM.
        var needsResync = !this.moldBinding || this.moldBinding.isNew;
        this.moldBinding.refreshState(template, this);
        if (this.moldBinding.phase())
            needsResync = true;
        if (needsResync) {
            compile_1.compileNode(template);
            // Schedule child node sync on the first non-template ancestor element.
            var node = template;
            while (node = node.parentNode) {
                if (node instanceof Element && node.tagName !== 'TEMPLATE') {
                    queue.plan(Trace.getTrace(node));
                    break;
                }
            }
        }
    };
    Trace.prototype.destroy = function () {
        if (this.moldBinding)
            this.moldBinding.destroy();
        if (this.attributeBindings) {
            for (var _i = 0, _a = this.attributeBindings; _i < _a.length; _i++) {
                var binding = _a[_i];
                binding.destroy();
            }
        }
        if (this.vm && typeof this.vm.onDestroy === 'function') {
            this.vm.onDestroy();
        }
        delete this.virtual[traceKey];
        this.virtual = null;
        this.real = null;
        this.dynamicAncestor = null;
    };
    Trace.hasTrace = function (virtual) {
        return virtual.hasOwnProperty(traceKey);
    };
    Trace.getTrace = function (virtual) {
        if (Trace.hasTrace(virtual))
            return virtual[traceKey];
        return null;
    };
    Trace.getOrAddTrace = function (virtual) {
        if (Trace.hasTrace(virtual))
            return virtual[traceKey];
        // IE 10/11 workaround, see State.
        if (virtual instanceof Text && utils.msie) {
            var parentState = Trace.getTrace(virtual.parentNode);
            if (!parentState.msieChildTextNodes)
                parentState.msieChildTextNodes = [];
            parentState.msieChildTextNodes.push(virtual);
        }
        virtual[traceKey] = new Trace(virtual);
        return virtual[traceKey];
    };
    Trace.addRootTrace = function (virtual, real) {
        utils.assert(virtual instanceof Element, "unexpected root trace addition to non-element:", virtual);
        utils.assert(real instanceof Element, "unexpected root trace addition to non-element:", virtual);
        var trace = new Trace(virtual, real);
        trace.isRoot = true;
        trace.markDynamic();
        virtual[traceKey] = trace;
        return trace;
    };
    Trace.getDynamicAncestor = function (virtual) {
        var trace;
        while (virtual.parentNode) {
            virtual = virtual.parentNode;
            trace = Trace.getTrace(virtual);
            if (trace.dynamic)
                return trace;
        }
        return trace || null;
    };
    return Trace;
})();
exports.Trace = Trace;
function syncChildNodes(virtual, real) {
    var children = [];
    for (var i_1 = 0, ii_1 = virtual.childNodes.length; i_1 < ii_1; ++i_1) {
        var child = virtual.childNodes[i_1];
        if (child instanceof Element && child.tagName === 'TEMPLATE') {
            children.push.apply(children, unpackMold(child));
        }
        else {
            children.push(child);
        }
    }
    // Compare the children side by side.
    for (var i = 0, ii = children.length; i < ii; ++i) {
        var virtualChild = children[i];
        var realChild = real.childNodes[i];
        var trace = Trace.getTrace(virtualChild);
        // Put the real child in position.
        if (realChild !== trace.real) {
            real.insertBefore(trace.real, realChild || null);
            realChild = trace.real;
        }
        // Sync the rest of the tree.
        if (virtualChild instanceof Element && realChild instanceof Element) {
            syncChildNodes(virtualChild, realChild);
        }
    }
    // Remove excess.
    while (real.childNodes.length > children.length) {
        real.removeChild(real.lastChild);
    }
}
// Unpacks a mold's contents after it's been compiled and phased.
function unpackMold(template) {
    var nodes = [];
    for (var i = 0, ii = template.childNodes.length; i < ii; ++i) {
        var child = template.childNodes[i];
        if (child instanceof Element && child.tagName === 'TEMPLATE') {
            nodes.push.apply(nodes, unpackMold(child));
        }
        else {
            nodes.push(child);
        }
    }
    return nodes;
}
