'use strict';
var compile_1 = require('./compile');
var utils = require('./utils');
var metaKey = utils.uniqueKey('atrilMeta');
exports.roots = [];
var neutralZone = zone.fork();
// The queue is a list of virtual elements whose child list needs to be synced
// with the real element. This is done: (1) during the initial render; (2) when
// an element's child mold modifies its own contents.
var queue = {
    metas: [],
    plan: function (meta) {
        // Duplicate detection potentially slow(ish) when doing large updates
        // rapidly, TODO improve.
        if (!~queue.metas.indexOf(meta))
            queue.metas.push(meta);
    },
    flush: function () {
        while (queue.metas.length) {
            var meta = queue.metas.shift();
            // It's possible for a meta to be destroyed in the interval before the
            // flush.
            if (!meta.virtual)
                continue;
            syncChildNodes(meta.virtual, meta.real);
        }
    }
};
function flushQueue() {
    if (!queue.metas.length)
        return;
    // This method is called from within our usual zone, so we need to go into a
    // sibling zone for async DOM manipulation to avoid triggering another reflow.
    // TODO review the zone API to see if this can be done in a simpler way.
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
// A Meta belongs to a virtual node and stores all of our private data relevant
// to that node. Each node in the virtual DOM receives a Meta either during
// bootstrap or during compilation.
var Meta = (function () {
    function Meta(virtual, real) {
        this.virtual = null;
        this.real = null;
        this.vm = null;
        this.VM = null;
        this.scope = null;
        // A view tracks the progress of asynchronously fetching a view by URL. While
        // it exists (while a template is unavailable), this meta's node won't be
        // phased.
        this.view = null;
        // Allows to skip compilation on reflow.
        this.compiled = false;
        // Allows to skip render on reflow. On repeated renders, signals if the render
        // needs to be done immediately.
        this.synced = false;
        // Set by a mold as a promise to not modify the node or any of its
        // descendants. Allows us to skip recompilation of entire trees during phases.
        this.isDomImmutable = false;
        // A meta is marked as dynamic if it has any bindings.
        this.dynamic = false;
        // Closest ancestral dynamic meta.
        this.dynamicAncestor = null;
        // Descendant dynamic metas.
        this.dynamicDescendants = null;
        // True when the meta belongs to a root element.
        this.isRoot = false;
        this.textInterpolation = null;
        this.attributeInterpolations = null;
        this.attributeBindings = null;
        this.moldBinding = null;
        // Workaround for an IE10/11 problem where the browser removes non-standard
        // properties from text nodes (instances of Text). The problem is prevented if
        // references to those text nodes are kept _somewhere_ in the JavaScript code.
        // The reference also can't be held by the meta associated with the text node
        // in question, so we keep it on the parent meta to give it a good chance of
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
    Meta.prototype.markDynamic = function () {
        // Repeated dynamic registration happens when compiling components with
        // bindings on them.
        if (this.dynamic)
            return;
        var meta = Meta.getDynamicAncestor(this.virtual);
        if (meta) {
            if (!meta.dynamicDescendants)
                meta.dynamicDescendants = [];
            utils.assert(!~meta.dynamicDescendants.indexOf(this), "unexpected second dynamic registration of meta:", this);
            meta.dynamicDescendants.push(this);
            this.dynamicAncestor = meta;
        }
        this.dynamic = true;
    };
    Meta.prototype.insertScope = function (locals) {
        // Insert into the chain.
        if (!this.dynamic)
            this.markDynamic();
        this.scope = this.scope || Object.create(this.getScope());
        if (locals != null && typeof locals === 'object') {
            for (var key in locals)
                this.scope[key] = locals[key];
        }
    };
    Meta.prototype.getScope = function () {
        if (this.scope)
            return this.scope;
        var meta = this;
        while (meta = meta.dynamicAncestor) {
            if (meta.vm)
                return meta.vm;
            if (meta.scope)
                return meta.scope;
        }
        return null;
    };
    // Must follow the sequence: (two elements?) -> init VMs -> phase attributes
    // -> phase child nodes.
    Meta.prototype.phase = function () {
        utils.assert(this.dynamic, "unexpected phase() call on a non-dynamic meta:", this);
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
                this.vm = utils.instantiate(this.VM, { element: this.real });
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
                        var meta = _a[_i];
                        meta.phase();
                    }
                }
            }
            if (this.virtual.tagName !== 'TEMPLATE') {
                this.syncChildNodes();
            }
        }
        if (this.vm && typeof this.vm.onPhase === 'function')
            this.vm.onPhase();
    };
    Meta.prototype.phaseTextInterpolation = function () {
        var result = this.textInterpolation.call(this.real, this.getScope());
        if (this.real.textContent !== result)
            this.real.textContent = result;
    };
    Meta.prototype.phaseAttributeInterpolations = function () {
        var scope = this.getScope();
        for (var _i = 0, _a = this.attributeInterpolations; _i < _a.length; _i++) {
            var binding = _a[_i];
            var result = binding.expression.call(this.real, scope);
            if (binding.attr.value !== result)
                binding.attr.value = result;
        }
    };
    Meta.prototype.phaseAttributeBindings = function () {
        if (!this.attributeBindings.length)
            return;
        var scope = this.getScope();
        for (var _i = 0, _a = this.attributeBindings; _i < _a.length; _i++) {
            var binding = _a[_i];
            binding.refreshAndPhase(this.real, this);
        }
    };
    Meta.prototype.phaseMold = function () {
        var template = this.virtual;
        // Whether the mold needs recompilation and resync into the live DOM.
        var needsResync = !this.moldBinding || this.moldBinding.isNew;
        if (this.moldBinding) {
            if (this.moldBinding.refreshAndPhase(template, this))
                needsResync = true;
        }
        if (needsResync) {
            this.destroyDetachedMetas();
            compile_1.compileNode(template);
            // Schedule child node sync on the first non-template ancestor element.
            var node = template;
            while (node = node.parentNode) {
                if (node instanceof Element && node.tagName !== 'TEMPLATE') {
                    Meta.getMeta(node).syncChildNodes();
                    break;
                }
            }
        }
    };
    // Syncs the child nodes for own element either immediately or in the queue.
    // Immediate sync is required when rendering something for the first time.
    // This allows us to paint the initial page faster (at the cost of / with the
    // benefit of blocking the UI thread for a moment), and give components their
    // child nodes when calling their `onPhase` lifecycle method for the first
    // time.
    Meta.prototype.syncChildNodes = function () {
        utils.assert(this.virtual instanceof Element && this.virtual.tagName !== 'TEMPLATE' && this.real instanceof Element, "unexpected Meta#syncChildNodes on a meta with a non-Element:", this.virtual);
        if (this.synced)
            queue.plan(this);
        else {
            this.synced = true;
            syncChildNodes(this.virtual, this.real);
        }
    };
    Meta.prototype.destroy = function () {
        if (this.moldBinding)
            this.moldBinding.destroy();
        if (this.attributeBindings) {
            for (var _i = 0, _a = this.attributeBindings; _i < _a.length; _i++) {
                var binding = _a[_i];
                binding.destroy();
            }
        }
        // Remove other descendants, if any.
        if (this.dynamicDescendants) {
            while (this.dynamicDescendants.length) {
                this.dynamicDescendants.shift().destroy();
            }
        }
        if (this.vm && typeof this.vm.onDestroy === 'function') {
            this.vm.onDestroy();
        }
        delete this.virtual[metaKey];
        this.virtual = null;
        this.real = null;
        this.dynamicAncestor = null;
    };
    // Checks if the template's meta has any descendants whose elements are no
    // longer included into the virtual DOM, and destroys them.
    Meta.prototype.destroyDetachedMetas = function () {
        var descendants = this.dynamicDescendants;
        if (!descendants || !descendants.length)
            return;
        for (var i = 0; i < descendants.length; ++i) {
            var meta = descendants[i];
            var node = meta.virtual;
            var detached = true;
            while (node = node.parentNode) {
                if (node === this.virtual) {
                    detached = false;
                    break;
                }
            }
            if (detached) {
                meta.destroy();
                descendants.splice(i, 1);
                i--;
            }
        }
    };
    Meta.hasMeta = function (virtual) {
        return virtual.hasOwnProperty(metaKey);
    };
    Meta.getMeta = function (virtual) {
        if (Meta.hasMeta(virtual))
            return virtual[metaKey];
        return null;
    };
    Meta.getOrAddMeta = function (virtual) {
        if (Meta.hasMeta(virtual))
            return virtual[metaKey];
        // IE 10/11 workaround, see Meta.
        if (virtual instanceof Text && utils.msie) {
            var parentMeta = Meta.getMeta(virtual.parentNode);
            if (!parentMeta.msieChildTextNodes)
                parentMeta.msieChildTextNodes = [];
            parentMeta.msieChildTextNodes.push(virtual);
        }
        virtual[metaKey] = new Meta(virtual);
        return virtual[metaKey];
    };
    Meta.addRootMeta = function (virtual, real) {
        utils.assert(virtual instanceof Element, "unexpected root meta addition to non-element:", virtual);
        utils.assert(real instanceof Element, "unexpected root meta addition to non-element:", virtual);
        var meta = new Meta(virtual, real);
        meta.isRoot = true;
        meta.markDynamic();
        virtual[metaKey] = meta;
        return meta;
    };
    Meta.getDynamicAncestor = function (virtual) {
        var meta;
        while (virtual.parentNode) {
            virtual = virtual.parentNode;
            meta = Meta.getMeta(virtual);
            if (meta.dynamic)
                return meta;
        }
        return meta || null;
    };
    return Meta;
})();
exports.Meta = Meta;
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
        var meta = Meta.getMeta(virtualChild);
        // Put the real child in position.
        if (realChild !== meta.real) {
            real.insertBefore(meta.real, realChild || null);
            realChild = meta.real;
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
