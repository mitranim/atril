import {Component} from 'atril';

@Component({
  tagName: 'todo-list'
})
class VM {
  text = '';
  items = [
    {text: 'Learn a new framework', completed: true},
    {text: 'Be awesome'}
  ];
  newItem = {text: '', completed: false};

  add() {
    this.items.unshift(this.newItem);
    this.newItem = {text: '', completed: false};
  }

  remove(item) {
    this.items.splice(this.items.indexOf(item), 1);
  }

  static viewUrl = 'app/todo-list/todo-list.html';
}
