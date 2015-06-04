'use strict';
require('./attributes');
require('./bindings');
var boot_1 = require('./boot');
exports.Attribute = boot_1.Attribute;
exports.bootstrap = boot_1.bootstrap;
exports.Component = boot_1.Component;
exports.Mold = boot_1.Mold;
exports.scheduleReflow = boot_1.scheduleReflow;
require('./compile');
var tree_1 = require('./tree');
exports.getOrAddState = tree_1.getOrAddState;
var utils_1 = require('./utils');
exports.bindable = utils_1.bindable;
var view_1 = require('./view');
exports.viewCache = view_1.viewCache;

Object.defineProperty(exports, '__esModule', {
  value: true
});
