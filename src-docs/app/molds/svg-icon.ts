import {Mold, assign, viewCache} from 'atril';

/**
 * SVG icon helper with optional async loading.
 */
@Mold({
  attributeName: 'svg-icon'
})
class Ctrl {
  @assign attribute: Attr;
  @assign hint: string;
  @assign element: HTMLTemplateElement;

  content: DocumentFragment;

  constructor() {
    this.content = this.element.content;
    let path = 'app/svg/' + this.attribute.value + '.svg';

    let view = viewCache.get(path);
    if (typeof view === 'string') this.commit(view);
    else {
      viewCache.load(path).then(view => {this.commit(view)});
    }
  }

  commit(view: string): void {
    let child = <HTMLElement>this.content.firstChild;
    this.element.appendChild(this.content.removeChild(child));
    if (child.tagName !== 'SF-ICON') child.classList.add('sf-icon');
    child.innerHTML = view;
  }
}
