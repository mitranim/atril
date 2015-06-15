import {Mold, assign} from 'atril';

@Mold({attributeName: 'href-active'})
class Ctrl {
  @assign element: HTMLTemplateElement;
  @assign hint: string;

  constructor() {
    let content = this.element.content;

    while (content.hasChildNodes()) {
      this.element.appendChild(content.removeChild(content.firstChild));
    }

    let anchors = this.element.querySelectorAll('a');
    for (let i = anchors.length - 1; i >= 0; --i) {
      let node = <HTMLAnchorElement>anchors[i];
      if (this.isActive(node.getAttribute('href'))) node.classList.add(this.hint);
      else node.classList.remove(this.hint);
    }
  }

  isActive(link: string): boolean {
    return ~location.pathname.indexOf(link) && !~location.pathname.indexOf(link + '/') ||
           location.pathname === '/atril/' && link === '';
  }
}
