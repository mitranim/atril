import {Component} from 'atril';

@Component({
  tagName: 'hello-world'
})
class ViewModel {
  name = 'world';
  static viewUrl = 'app/hello-world/hello-world.html';
}
