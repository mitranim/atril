import {Mold} from 'atril';
import hjs from 'highlightjs';

@Mold({
  attributeName: 'highlight'
})
class Ctrl {
  element: HTMLTemplateElement;
  // Language.
  hint: string;

  constructor() {
    let content = this.element.content;

    console.assert(content.firstChild instanceof HTMLPreElement,
                   `'highlight.*' expects to be used on a <pre> tag, got:`, content.firstChild);

    let pre = <HTMLPreElement>content.firstChild;

    // Convert existing content into text.
    let result = this.hint ? hjs.highlight(this.hint, pre.innerHTML): hjs.highlightAuto(pre.innerHTML);

    // Neuter interpolations. This is necessary because a mold's output is re-
    // compiled, so interpolations would be evaluated.
    result.value = result.value.replace(/\{\{((?:[^}]|}(?=[^}]))*)\}\}/g, '{{<span>$1</span>}}');

    // Transfer normal attributes.
    for (let i = 0, ii = this.element.attributes.length; i < ii; ++i) {
      let attr = this.element.attributes[i];
      if (!this.looksLikeCustomAttribute(attr.name)) {
        pre.setAttribute(attr.name, attr.value);
      }
    }

    // Render highlighted code.
    pre.innerHTML = `<code class="hljs lang-${result.language}">${result.value}</code>`;
    this.element.appendChild(pre);
  }

  looksLikeCustomAttribute(attributeName: string): boolean {
    return /^[a-z-]+\./.test(attributeName);
  }
}
