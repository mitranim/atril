import {Mold, getOrAddState} from 'atril';

@Mold({
  attributeName: 'doc-demo'
})
class Ctrl {
  // Autoassigned
  element: HTMLTemplateElement;
  hint: string;
  scope: any;

  constructor() {
    // Create a dummy scope for property assignments.
    let state = getOrAddState(this.element);
    if (!this.scope && !state.scope) state.scope = Object.create(null);

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
