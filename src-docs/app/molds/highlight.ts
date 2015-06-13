import {Mold, assign} from 'atril';
import hjs from 'highlightjs';

@Mold({
  attributeName: 'highlight'
})
class Ctrl {
  @assign element: HTMLTemplateElement;
  // Language.
  @assign hint: string;

  constructor() {
    let content = this.element.content;

    // Reuse or create a <pre>.
    let pre = content.firstChild instanceof HTMLPreElement ?
              <HTMLPreElement>content.firstChild : document.createElement('pre');

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
