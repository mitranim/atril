import {Component} from 'atril';

@Component({tagName: 'doc-sidenav'})
class VM {
  element: HTMLElement;

  isActive(link: string): boolean {
    return ~location.pathname.indexOf(link) && !~location.pathname.indexOf(link + '/') ||
           location.pathname === '/atril/' && link === '';
  }

  phase() {
    let anchors = this.element.querySelectorAll('a');
    for (let i = anchors.length - 1; i >= 0; --i) {
      let node = <HTMLAnchorElement>anchors[i];
      if (this.isActive(node.getAttribute('href'))) node.classList.add('active');
      else node.classList.remove('active');
    }
    // Expecting no pushstate transitions.
    this.phase = null;
  }

  static templateUrl = 'app/doc-sidenav/doc-sidenav.html';
}
