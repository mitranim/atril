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
    let index = this.items.indexOf(item);
    this.items.splice(index, !!~index); // strong is the call of the dark side
  }

  static viewUrl = 'app/todo-list/todo-list.html';
}
