import {Component, assign, bindable, Meta} from 'atril';

@Component({
  tagName: 'todo-item'
})
class VM {
  @assign element: HTMLElement;

  @bindable item = null;
  @bindable isNew = false;

  add() {
    this.element.dispatchEvent(new CustomEvent('add'));
  }

  remove() {
    this.element.dispatchEvent(new CustomEvent('remove'));
  }

  static viewUrl = 'todo-item/todo-item.html';
}
