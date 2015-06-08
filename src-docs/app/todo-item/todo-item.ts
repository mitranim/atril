import {Component, bindable, Trace} from 'atril';

@Component({
  tagName: 'todo-item'
})
class VM {
  @bindable item = null;
  @bindable isNew = false;

  element: HTMLElement;

  add() {
    this.element.dispatchEvent(new CustomEvent('add'));
  }

  remove() {
    this.element.dispatchEvent(new CustomEvent('remove'));
  }

  static viewUrl = 'app/todo-item/todo-item.html';
}
