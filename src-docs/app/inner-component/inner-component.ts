import {Component, bindable} from 'atril';

@Component({tagName: 'inner-component'})
class VM {
  @bindable val = null;
  @bindable color = 'red';

  static viewUrl = 'inner-component/inner-component.html';
}
