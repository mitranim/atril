'use strict';
'Thou shalt not comment.';
var utils = require('./utils');
var view_1 = require('./view');
var compile_1 = require('./compile');
var tree_1 = require('./tree');
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
exports.registeredComponents = Object.create(null);
exports.registeredAttributes = Object.create(null);
exports.registeredMolds = Object.create(null);
function bootstrap() {
    localZone.run(function bootstrap(element) {
        if (element === void 0) { element = document.body; }
        console.assert(element instanceof Element, "bootstrap expects an Element, got:", element);
        // Don't register components twice.
        for (var i = 0, ii = tree_1.roots.length; i < ii; ++i) {
            var root = tree_1.roots[i];
            if (root.real === element)
                return;
        }
        var VM = exports.registeredComponents[element.tagName.toLowerCase()];
        if (VM) {
            tree_1.roots.push(createRootAt(element, VM));
            return;
        }
        var nodes = element.childNodes;
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
                        if (utils.customAttributeName(attr.name) in exports.registeredAttributes) {
                            var root = createRootAt(element);
                            compile_1.compileNode(root.virtual);
                            tree_1.roots.push(root);
                            return;
                        }
                    }
                }
                // Otherwise continue normally.
                bootstrap(node);
            }
        }
    });
}
exports.bootstrap = bootstrap;
function createRootAt(element, VM) {
    var root = new tree_1.Root();
    root.real = element;
    var virtual = element.cloneNode(true);
    var state = tree_1.getOrAddState(virtual);
    state.real = element;
    if (VM) {
        state.VM = VM;
        state.view = new view_1.View(VM);
        // view should take care of transclusion
        state.view.tryToCompile(virtual);
    }
    root.virtual = virtual;
    return root;
}
function Component(config) {
    var tagRegex = /^[a-z][a-z-]*[a-z]$/;
    // Type checks.
    console.assert(typeof config.tagName === 'string', "expected a string tagname, got:", config.tagName);
    console.assert(tagRegex.test(config.tagName), "the tagname must match regex " + tagRegex + ", got:", config.tagName);
    return function (VM) {
        console.assert(typeof VM === 'function', "expected a component class, got:", VM);
        console.assert(!exports.registeredComponents[config.tagName], "unexpected redefinition of component with tagname " + config.tagName);
        exports.registeredComponents[config.tagName] = VM;
    };
}
exports.Component = Component;
function Attribute(config) {
    var nameRegex = /^[a-z][a-z-]*[a-z]$/;
    // Type checks.
    console.assert(typeof config.attributeName === 'string', "expected a string attribute name, got:", config.attributeName);
    console.assert(nameRegex.test(config.attributeName), "the attribute name must match regex " + nameRegex + ", got:", config.attributeName);
    console.assert(!exports.registeredAttributes[config.attributeName], "unexpected redefinition of attribute " + config.attributeName);
    return function (VM) {
        console.assert(typeof VM === 'function', "expected an attribute class, got:", VM);
        exports.registeredAttributes[config.attributeName] = VM;
    };
}
exports.Attribute = Attribute;
function Mold(config) {
    return function (VM) {
        Attribute(config)(VM);
        exports.registeredMolds[config.attributeName] = true;
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
    for (var i = 0, ii = tree_1.roots.length; i < ii; ++i) {
        var root = tree_1.roots[i];
        if (!root.real.parentNode) {
            destroy(root.virtual);
            tree_1.roots.splice(i, 1);
            continue;
        }
        tree_1.phaseElements(root.virtual, root.real);
    }
}
function destroy(virtual) {
    var state = tree_1.getState(virtual);
    state.destroy();
    var nodes = virtual.childNodes;
    for (var i = 0, ii = nodes.length; i < ii; ++i) {
        var node = nodes[i];
        if (node instanceof Element)
            destroy(node);
    }
}
