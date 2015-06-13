'use strict';

import {scheduleReflow} from './boot';
import {Attribute, assign, isBindable} from './decorators';
import * as utils from './utils';
import {Pathfinder} from './utils';

@Attribute({attributeName: 'bind'})
class Bind {
  @assign element: Element;
  @assign hint: string;
  @assign expression: Expression;
  @assign scope: any;
  @assign vm: any;

  propertyPath: string;
  pathfinder: Pathfinder;

  constructor() {
    this.propertyPath = utils.normalise(this.hint);
    this.pathfinder = new Pathfinder(this.propertyPath);
  }

  onPhase(): void {
    let result = this.expression(this.scope);
    // Sync the result to the element. Dirty checking avoids setter side effects.
    if (!utils.strictEqual(this.pathfinder.read(this.element), result)) {
      this.pathfinder.assign(this.element, result);
    }
    // If the element has a VM that declares this property as bindable, sync
    // the result to it. Dirty checking avoids setter side effects.
    let vm = this.vm;
    if (vm && isBindable(vm, this.propertyPath) &&
        !utils.strictEqual(this.pathfinder.read(vm), result)) {
      this.pathfinder.assign(vm, result);
    }
  }
}

@Attribute({attributeName: 'twoway'})
class TwoWay {
  @assign element: Element;
  @assign attribute: Attr;
  @assign hint: string;
  @assign scope: any;
  @assign vm: any;

  targetPropertyPath: string;
  targetPathfinder: Pathfinder;
  ownPathfinder: Pathfinder;
  lastOwnValue: any;
  lastTargetValue: any;

  constructor() {
    utils.assert(utils.isKebabStaticPathAccessor(this.hint), `a 'twoway.*' attribute must be of form 'twoway.X(.X)*', where X is a valid JavaScript identifier in kebab form; got: '${this.attribute.name}'`);

    this.ownPathfinder = new Pathfinder(this.attribute.value);
    this.targetPropertyPath = utils.normalise(this.hint);
    this.targetPathfinder = new Pathfinder(this.targetPropertyPath);

    // When dealing with native inputs, add event listeners to trigger phases.
    // For inputs with known events and value properties, sync the value
    // directly in the event listener to avoid double reflow.
    if (this.element.tagName === 'INPUT' || this.element.tagName === 'TEXTAREA') {
      let elem = <HTMLInputElement|HTMLTextAreaElement>this.element;
      if (elem.type === 'checkbox') {
        elem.addEventListener('change', () => {this.syncBottomUp((<any>elem).checked)});
      } else {
        elem.addEventListener('input', () => {this.syncBottomUp(elem.value)});
      }
    } else if (this.element.tagName === 'SELECT') {
      let elem = <HTMLSelectElement>this.element;
      elem.addEventListener('change', () => {this.syncBottomUp(elem.value)});
    }
  }

  onPhase(): void {
    let firstPhase = !this.hasOwnProperty('lastOwnValue');
    let ownValue = this.ownPathfinder.read(this.scope);

    if (firstPhase) {
      let targetValue = this.getTargetValue();
      if (ownValue && !targetValue) this.syncTopDown(ownValue);
      if (targetValue && !ownValue) this.syncBottomUpAndReflow(targetValue);
      if (typeof targetValue !== typeof ownValue) this.syncBottomUpAndReflow(targetValue);
      else this.syncTopDown(ownValue);
      return;
    }

    // If own value has changed, overwrite the others. Own takes priority.
    if (!utils.strictEqual(ownValue, this.lastOwnValue)) {
      this.syncTopDown(ownValue);
      return;
    }

    // Otherwise sync the data back from the target. Don't bother syncing the
    // data between the target element and its VM.
    let targetValue = this.getTargetValue();
    if (!utils.strictEqual(targetValue, this.lastTargetValue)) {
      this.syncBottomUpAndReflow(targetValue);
    }
  }

  syncTopDown(newValue: any): void {
    this.lastOwnValue = newValue;
    this.lastTargetValue = newValue;

    // Sync the result to the element. Dirty checking avoids setter side effects.
    if (!utils.strictEqual(this.targetPathfinder.read(this.element), newValue)) {
      this.targetPathfinder.assign(this.element, newValue);
    }

    // If the element has a VM that declares this property as bindable, sync
    // the result to it. Dirty checking avoids setter side effects.
    let vm = this.vm;
    if (vm && isBindable(vm, this.targetPropertyPath)) {
      if (!utils.strictEqual(this.targetPathfinder.read(vm), newValue)) {
        this.targetPathfinder.assign(vm, newValue);
      }
    }
  }

  syncBottomUp(newValue: any): boolean {
    this.lastOwnValue = newValue;
    this.lastTargetValue = newValue;

    if (!utils.strictEqual(this.ownPathfinder.read(this.scope), newValue)) {
      this.ownPathfinder.assign(this.scope, newValue);
      return true;
    }

    return false;
  }

  syncBottomUpAndReflow(newValue: any): void {
    if (this.syncBottomUp(newValue)) scheduleReflow();
  }

  getTargetValue(): any {
    let vm = this.vm;
    if (vm && isBindable(vm, this.targetPropertyPath)) {
      return this.targetPathfinder.read(vm);
    }
    return  this.targetPathfinder.read(this.element);
  }
}

@Attribute({attributeName: 'on'})
class On {
  @assign element: Element;
  @assign hint: string;
  @assign expression: Expression;
  @assign scope: any;

  constructor() {
    this.element.addEventListener(this.hint, event => {
      let result = this.expression.call(this.element, this.scope, {$event: event});
      if (result === false) event.preventDefault();
    });
  }
}

@Attribute({attributeName: 'class'})
class Class {
  @assign element: Element;
  @assign hint: string;
  @assign expression: Expression;
  @assign scope: any;

  onPhase() {
    let result = this.expression(this.scope);
    if (result) this.element.classList.add(this.hint);
    else this.element.classList.remove(this.hint);
  }
}

@Attribute({attributeName: 'ref'})
class Ref {
  @assign element: Element;
  @assign attribute: Attr;
  @assign hint: string;
  @assign scope: any;
  @assign vm: any;

  constructor() {
    utils.assert(!this.hint || this.hint === 'vm',
                   `expected 'ref.' or 'ref.vm', got: '${this.attribute.name}'`);
    let pathfinder = new Pathfinder(this.attribute.value);
    if (this.scope) {
      pathfinder.assign(this.scope, this.hint === 'vm' ? this.vm : this.element);
    }
  }
}
