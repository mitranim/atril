import {Mold, templateCache} from 'atril';

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

    let template = templateCache.get(path);
    if (typeof template === 'string') this.commit(template);
    else {
      templateCache.load(path).then(template => this.commit(template));
    }
  }

  commit(template: string): void {
    this.element.appendChild(this.content.firstChild);
    (<HTMLElement>this.element.firstChild).innerHTML = template;
  }
}
