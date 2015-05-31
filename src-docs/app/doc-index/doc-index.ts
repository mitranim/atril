import {Component} from 'atril';

@Component({tagName: 'doc-index'})
class VM {
  name = '';
  age = NaN;
  color = '';
  checked = true;

  static templateUrl = 'app/doc-index/doc-index.html';
}
