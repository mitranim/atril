'use strict';

export {compileExpression} from './bindings';
export {bootstrap, scheduleReflow} from './boot';
export {Attribute, Component, Mold, bindable, assign} from './decorators';
export {Meta} from './tree';
export {instantiate} from './utils';
export {viewCache} from './view';

// Imported for the side effect of registering these built-ins.
import './attributes';
import './molds';
