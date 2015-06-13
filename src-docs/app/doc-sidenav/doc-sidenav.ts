import {Component, assign} from 'atril';

@Component({tagName: 'doc-sidenav'})
class VM {
  @assign element: HTMLElement;

  isActive(link: string): boolean {
    return ~location.pathname.indexOf(link) && !~location.pathname.indexOf(link + '/') ||
           location.pathname === '/atril/' && link === '';
  }

  onPhase() {
    let anchors = this.element.querySelectorAll('a');
    for (let i = anchors.length - 1; i >= 0; --i) {
      let node = <HTMLAnchorElement>anchors[i];
      if (this.isActive(node.getAttribute('href'))) node.classList.add('active');
      else node.classList.remove('active');
    }
  }

  static viewUrl = 'app/doc-sidenav/doc-sidenav.html';
}
