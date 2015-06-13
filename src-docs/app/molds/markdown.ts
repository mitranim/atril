import {Mold, assign} from 'atril';
import marked from 'marked';

@Mold({
  attributeName: 'markdown'
})
class Ctrl {
  @assign element: HTMLTemplateElement;

  constructor() {
    let content = this.element.content;

    // Convert existing content into text.
    let buffer = document.createElement('div');
    while (content.hasChildNodes()) {
      buffer.appendChild(content.firstChild);
    }

    // Render into markdown.
    let result = marked(buffer.innerHTML);
    buffer.innerHTML = result;

    // Fix code highlighting classes.
    let codeBlocks = buffer.querySelectorAll('pre code');
    for (let i = 0, ii = codeBlocks.length; i < ii; ++i) {
      let node = codeBlocks[i];
      if (node instanceof Element) node.classList.add('hljs');
    }

    while (buffer.hasChildNodes()) {
      this.element.appendChild(buffer.removeChild(buffer.firstChild));
    }
  }
}
