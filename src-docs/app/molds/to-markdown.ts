import {Mold, assign} from 'atril';
import marked from 'marked';

@Mold({
  attributeName: 'to-markdown'
})
class Ctrl {
  @assign element: HTMLTemplateElement;
  @assign expression: Function;
  @assign scope: any;

  buffer: HTMLElement;
  lastValue: string;

  constructor() {
    this.buffer = document.createElement('div');
    this.rewrite();
  }

  onPhase() {
    this.rewrite();
  }

  rewrite() {
    let value = this.expression(this.scope) || '' + '';
    if (value === this.lastValue) return;

    this.buffer.innerHTML = marked(value);

    // Fix code highlighting classes.
    let codeBlocks = this.buffer.querySelectorAll('pre code');
    for (let i = 0, ii = codeBlocks.length; i < ii; ++i) {
      let node = codeBlocks[i];
      if (node instanceof Element) node.classList.add('hljs');
    }

    // Remove existing content.
    while (this.element.hasChildNodes()) {
      this.element.removeChild(this.element.firstChild);
    }

    // Add new content.
    while (this.buffer.hasChildNodes()) {
      this.element.appendChild(this.buffer.removeChild(this.buffer.firstChild));
    }

    this.lastValue = value;
  }
}
