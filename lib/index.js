'use strict';
var bindings_1 = require('./bindings');
exports.compileExpression = bindings_1.compileExpression;
var boot_1 = require('./boot');
exports.bootstrap = boot_1.bootstrap;
exports.scheduleReflow = boot_1.scheduleReflow;
var decorators_1 = require('./decorators');
exports.Attribute = decorators_1.Attribute;
exports.Component = decorators_1.Component;
exports.Mold = decorators_1.Mold;
exports.bindable = decorators_1.bindable;
exports.assign = decorators_1.assign;
var tree_1 = require('./tree');
exports.Meta = tree_1.Meta;
var utils_1 = require('./utils');
exports.instantiate = utils_1.instantiate;
var view_1 = require('./view');
exports.viewCache = view_1.viewCache;
// Imported for the side effect of registering these built-ins.
require('./attributes');
require('./molds');

Object.defineProperty(exports, '__esModule', {
  value: true
});
