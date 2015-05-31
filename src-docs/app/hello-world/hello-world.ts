import {Component} from 'atril';

@Component({
  tagName: 'hello-world'
})
class ViewModel {
  name = 'world';
  static templateUrl = 'app/hello-world/hello-world.html';
}
