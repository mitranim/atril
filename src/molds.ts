'use strict';

import {Mold, assign} from './decorators';
import {Meta} from './tree';
import * as utils from './utils';

@Mold({attributeName: 'if'})
class If {
  @assign element: TemplateElement;
  @assign hint: string;
  @assign expression: Expression;
  @assign scope: any;

  stash: Node[] = [];

  constructor() {
    utils.assert(this.hint === '', `custom attribute 'if' doesn't support hints, got ${this.hint}`);

    let container = this.element.content;
    while (container.hasChildNodes()) {
      let child = container.removeChild(container.lastChild);
      Meta.getOrAddMeta(child).isDomImmutable = true;
      this.stash.unshift(child);
    }
  }

  onPhase(): void {
    let ok = !!this.expression(this.scope);

    if (ok) while (this.stash.length) {
      this.element.appendChild(this.stash.shift());
    } else while (this.element.hasChildNodes()) {
      this.stash.unshift(this.element.removeChild(this.element.lastChild))
    }
  }
}

@Mold({attributeName: 'for'})
class For {
  @assign element: TemplateElement;
  @assign hint: string;
  @assign expression: Expression;
  @assign scope: any;

  mode: string; // 'of' | 'in' | 'any'
  key: string;
  originals: Node[] = [];
  stash: Node[] = [];

  constructor() {
    let msg = `the 'for.*' attribute expects a hint in the form of 'X.of', 'X.in', or 'X', where X is a valid JavaScript identifier; received '${this.hint}'`;

    let match = utils.matchValidKebabIdentifier(this.hint);
    utils.assert(!!match, msg);

    // Find the variable key.
    this.key = utils.normalise(match[1]);

    // Choose the iteration strategy.
    if (!match[2]) this.mode = 'any';
    else if (match[2] === '.of') this.mode = 'of';
    else if (match[2] == '.in') this.mode = 'in';

    utils.assert(!!this.mode, msg);

    // Move the initial content to a safer place.
    let container = this.element.content;
    while (container.hasChildNodes()) {
      this.originals.unshift(container.removeChild(container.lastChild));
    }
  }

  onPhase(): void {
    let value = this.expression(this.scope);

    let isIterable = value instanceof Array || typeof value === 'string' ||
                     (value != null && typeof value === 'object' && this.mode !== 'of');

    // Stash existing content.
    while (this.element.hasChildNodes()) {
      this.stash.unshift(this.element.removeChild(this.element.lastChild));
    }

    if (!isIterable || !this.originals.length) return;

    if (this.mode === 'in' || !utils.isArrayLike(value)) this.iterateIn(value);
    else this.iterateOf(value);
  }

  iterateOf(value: ArrayLike): void {
    for (var i = 0, ii = value.length; i < ii; ++i) {
      this.step(value, i);
    }
  }

  iterateIn(value: {[key: string]: any}): void {
    for (let key in value) this.step(value, key);
  }

  step(value: any, index: number|string): void {
    let nodes: Node[];
    if (this.stash.length >= this.originals.length) {
      nodes = this.stash.splice(0, this.originals.length);
    } else {
      nodes = this.originals.map(node => {
        let clone = utils.cloneDeep(node);
        Meta.getOrAddMeta(clone).isDomImmutable = true;
        return clone;
      });
    }

    while (nodes.length) {
      let node = nodes.shift();
      this.element.appendChild(node);
      Meta.getOrAddMeta(node).insertScope({
        $index: index,
        [this.key]: value[index]
      });
    }
  }
}

@Mold({attributeName: 'let'})
class Let {
  @assign element: TemplateElement;
  @assign hint: string;
  @assign expression: Expression;
  @assign scope: any;

  constructor() {
    utils.assert(utils.isValidKebabIdentifier(this.hint),
                   `'let.*' expects the hint to be a valid JavaScript identifier in kebab form, got: '${this.hint}'`);

    let identifier = utils.normalise(this.hint);

    // Make sure a scope is available.
    if (!this.scope) {
      let meta = Meta.getOrAddMeta(this.element);
      meta.insertScope();
      this.scope = meta.scope;
    }

    // The identifier must not be redeclared in the scope. We're being strict to
    // safeguard against elusive errors.
    utils.assert(!Object.prototype.hasOwnProperty.call(this.scope, identifier),
                   `unexpected re-declaration of '${identifier}' with 'let'`);

    // Bring the identifier into scope, assigning the given value.
    this.scope[identifier] = this.expression.call(this.scope, this.scope);

    // Pass through any content.
    let content = this.element.content;
    while (content.hasChildNodes()) {
      this.element.appendChild(content.removeChild(content.firstChild));
    }
  }
}
