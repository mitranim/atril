import {Component, bindable} from 'atril';

@Component({tagName: 'inner-component'})
class VM {
  @bindable val = null;
  @bindable color = 'red';

  static templateUrl = 'app/inner-component/inner-component.html';
}
