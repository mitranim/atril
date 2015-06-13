import {Mold, Meta, assign} from 'atril';

@Mold({
  attributeName: 'doc-demo'
})
class Ctrl {
  @assign element: HTMLTemplateElement;
  @assign hint: string;
  @assign scope: any;

  constructor() {
    console.assert(!this.hint, `'doc-demo.' doesn't expect any hints, got: ${this.hint}`);

    // Fork the scope. Useful for avoiding `let` conflicts in demos. Not
    // recommended for other scenarios.
    let meta = Meta.getMeta(this.element);
    if (!this.scope) this.scope = null;
    if (!meta.scope) {
      meta.insertScope();
      this.scope = meta.scope;
    }

    // Add a demo wrapper.
    let div = document.createElement('div');
    div.classList.add('doc-demo');
    div.innerHTML =
      `<p>
        <sf-icon svg-icon.="info-circle" class="inline text-info"></sf-icon>
        Demo
      </p>`;

    let fragment = this.element.content;
    while (fragment.hasChildNodes()) {
      div.appendChild(fragment.removeChild(fragment.firstChild));
    }
    this.element.appendChild(div);
  }
}
