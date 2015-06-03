import {Mold, viewCache} from 'atril';

/**
 * SVG icon helper with optional async loading.
 */
@Mold({
  attributeName: 'svg-icon'
})
class Ctrl {
  // Autoassigned
  element: HTMLTemplateElement;
  hint: string;

  // Custom
  attrName: string;
  content: DocumentFragment;

  constructor() {
    this.attrName = 'svg-icon.' + this.hint;
    this.content = this.element.content;
    let iconName = this.element.getAttribute(this.attrName);
    let path = 'app/svg/' + iconName + '.svg';

    let view = viewCache.get(path);
    if (typeof view === 'string') this.commit(view);
    else {
      viewCache.load(path).then(view => this.commit(view));
    }
  }

  commit(view: string): void {
    this.element.appendChild(this.content.firstChild);
    (<HTMLElement>this.element.firstChild).innerHTML = view;
  }
}