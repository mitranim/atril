import {Attribute, assign} from 'atril';

@Attribute({attributeName: 'autolink'})
class Ctrl {
  @assign element: HTMLAnchorElement;
  @assign attribute: Attr;

  constructor() {
    if (!(this.element instanceof HTMLAnchorElement)) return;

    this.element.id = this.attribute.value;

    let base = document.head.querySelector('base').getAttribute('href');
    let prefix = location.pathname.replace(base, '');
    this.element.href = prefix + '#' + this.attribute.value;
  }
}
