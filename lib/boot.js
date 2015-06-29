'use strict';
'Thou shalt not comment.';
require('zone.js');
var utils = require('./utils');
var view_1 = require('./view');
var compile_1 = require('./compile');
var decorators_1 = require('./decorators');
var tree_1 = require('./tree');
var reflowStackDepth = 0;
var maxRecursiveReflows = 10;
var reflowScheduled = false;
var localZone = zone.fork({
    afterTask: function () {
        // zone.js automatically reruns a task after ≈1 s if the task throws. It
        // also hides all exceptions after the first during these retries. For us,
        // if a binding or component consistently throws during a phase, it causes
        // continuous reflows. To avoid that, we have to capture the exception.
        // try {
        reflowStackDepth = 0;
        reflow();
        tree_1.flushQueue();
        // }
        // catch (err) {utils.error(err)}
    }
});
function scheduleReflow() {
    reflowScheduled = true;
}
exports.scheduleReflow = scheduleReflow;
function reflow() {
    reflowStackDepth++;
    if (reflowStackDepth >= maxRecursiveReflows) {
        throw new Error("reached " + maxRecursiveReflows + " recursive reflow phases, aborting");
    }
    reflowWithUnlimitedStack();
    if (reflowScheduled) {
        reflowScheduled = false;
        reflow();
    }
}
function reflowWithUnlimitedStack() {
    for (var i = 0, ii = tree_1.roots.length; i < ii; ++i) {
        var root = tree_1.roots[i];
        if (!root.real.parentNode) {
            destroy(root.virtual);
            tree_1.roots.splice(i, 1);
            continue;
        }
        tree_1.Meta.getMeta(root.virtual).phase();
    }
}
function destroy(virtual) {
    var meta = tree_1.Meta.getMeta(virtual);
    meta.destroy();
    var nodes = virtual.childNodes;
    for (var i = 0, ii = nodes.length; i < ii; ++i) {
        var node = nodes[i];
        if (node instanceof Element)
            destroy(node);
    }
}
function bootstrap() {
    // IE10 compat: doesn't support `apply` for function expressions. Have to
    // define it in a statement.
    function boot(element) {
        if (element === void 0) { element = document.body; }
        utils.assert(element instanceof Element, "bootstrap expects an Element, got:", element);
        // Don't register components twice.
        for (var _i = 0; _i < tree_1.roots.length; _i++) {
            var root = tree_1.roots[_i];
            if (root.real === element)
                return;
        }
        var VM = decorators_1.registeredComponents[element.tagName.toLowerCase()];
        if (VM) {
            tree_1.roots.push(createRootAt(element, VM));
            return;
        }
        // Child scan must be breadth-first because a child may register the current
        // element as a root. If we go depth-first, we may end up with a root that
        // is also a descendant of another root. So we need two passes over the
        // child list.
        var nodes = element.childNodes;
        // First pass.
        for (var i = 0, ii = nodes.length; i < ii; ++i) {
            var node = nodes[i];
            if (node instanceof Element) {
                // Check if there's a least one registered custom attribute for this
                // element (or a mold, if this is a template). Unlike the normal compile
                // process, this doesn't throw an error in case of mismatch.
                var attrs = node.attributes;
                for (var i_1 = 0, ii_1 = attrs.length; i_1 < ii_1; ++i_1) {
                    var attr = attrs[i_1];
                    if (utils.looksLikeCustomAttribute(attr.name)) {
                        if (utils.customAttributeName(attr.name) in decorators_1.registeredAttributes) {
                            var root = createRootAt(element);
                            compile_1.compileNode(root.virtual);
                            tree_1.roots.push(root);
                            return;
                        }
                    }
                }
            }
        }
        // Second pass.
        for (var i = 0, ii = nodes.length; i < ii; ++i) {
            var node = nodes[i];
            if (node instanceof Element)
                boot(node);
        }
    }
    utils.onload(function () { localZone.run(boot); });
}
exports.bootstrap = bootstrap;
function createRootAt(element, VM) {
    var root = new tree_1.Root();
    root.real = element;
    var virtual = utils.cloneDeep(element);
    var meta = tree_1.Meta.addRootMeta(virtual, element);
    if (VM) {
        meta.VM = VM;
        meta.view = new view_1.View(VM);
        // view should take care of transclusion
        meta.view.tryToCompile(virtual);
    }
    root.virtual = virtual;
    return root;
}
