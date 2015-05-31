import {Draft} from 'atril';
import marked from 'marked';
import hjs from 'highlightjs';

marked.setOptions({
  gfm:         true,
  tables:      true,
  breaks:      false,
  sanitize:    false,
  smartypants: false,
  pedantic:    false,
  highlight: (code, lang) => {
    if (lang) return hjs.highlight(lang, code).value;
    return hjs.highlightAuto(code).value;
  }
});

@Draft({
  attributeName: 'markdown'
})
class Ctrl {
  element: HTMLElement;

  constructor() {
    let content = <DocumentFragment>(<any>this.element).content;

    // Convert existing content into text.
    let buffer = document.createElement('div');
    while (content.hasChildNodes()) {
      buffer.appendChild(content.firstChild);
    }

    // Render into markdown.
    let result = marked(buffer.innerHTML);

    // Neuter interpolations. This is necessary because a draft's output is re-
    // compiled, so interpolations would be evaluated.
    result = result.replace(/\{\{((?:[^}]|}(?=[^}]))*)\}\}/g, '{{<span>$1</span>}}');

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
