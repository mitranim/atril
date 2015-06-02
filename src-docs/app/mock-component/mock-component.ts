import {Component} from 'atril';
import {testUrl, ajax, randomString} from 'utils/utils';

@Component({tagName: 'mock-component'})
class VM {
  element: HTMLElement;

  value = 'world';
  color = 'blue';
  fetched = '';
  inputValue = '';
  checked = false;

  constructor() {
    setTimeout(() => {
      this.value = randomString();
    }, 1000);

    ajax(testUrl)
      .then(value => {
        this.fetched = value;
      });
  }

  randomString() {return randomString()}

  static viewUrl = 'app/mock-component/mock-component.html';
}
