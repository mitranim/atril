## Attribute

<div class="info pad decorate-links">
  <p>Quicklinks:</p>
  <ul>
    <li><a href="attribute/#basics">Basics</a></li>
    <li><a href="attribute/#contextual-dependencies">Contextual Dependencies</a></li>
    <li><a href="attribute/#lifecycle">Lifecycle</a></li>
  </ul>
</div>

A custom attribute changes how the element behaves in the real DOM.

Attributes are powerful. One- and two-way databinding in `atril` is implemented
entirely with attributes, with no special treatment from the core engine.

When using a custom attribute, you have to "opt in" by adding a dot to the name.
You can also add an optional _hint_ after the dot to customise its behaviour,
like `value` in `bind.value`. Most built-ins support various hints. This makes
custom attributes very flexible and ensures no conflict with other attributes.

### Basics

Here's an example attribute. This is the entire implementation of the built-in
`class.*` binding.

<div class="code-pair">
<pre highlight.typescript>
import {Attribute, assign} from 'atril';

@Attribute({attributeName: 'class'})
class Ctrl {
  // Autoassigned by the framework.
  @assign element: Element;
  @assign hint: string;
  @assign expression: Function;
  @assign scope: any;

  onPhase() {
    let result = this.expression(this.scope);
    if (result) this.element.classList.add(this.hint);
    else this.element.classList.remove(this.hint);
  }
}
</pre>

<pre highlight.html>
<div let.checked="true">
  <!-- Set class `info` when `checked` is true
       and `error` otherwise. -->
  <label class.info="checked" class.error="!checked">

    <input twoway.checked="checked" type="checkbox">

    <span>I'm checked: {{checked}}</span>

  </label>
</div>
</pre>
</div>

<template doc-demo. let.checked="true">
  <div class="pad-v">
    <label class="pad" class.info="checked" class.error="!checked">
      <input twoway.checked="checked" type="checkbox">
      <span>I'm checked: {{checked}}</span>
    </label>
  </div>
</template>

### Contextual Dependencies

The framework uses a variant of dependency injection — _dependency assignment_ —
to give you contextual dependencies for each attribute controller. To get hold
of them, use the `@assign` decorator (ES7/TypeScript) or the static `assign`
property on the constructor function (ES5).

A custom attribute has the following contextual dependencies:
* `element` — the real DOM element;
* `attribute` — the associated
  [`Attr`](https://developer.mozilla.org/en-US/docs/Web/API/Attr) object on the
  DOM element;
* `hint` — the part in the attribute name after the dot;
* `expression` — the expression automatically compiled from the attribute value;
* `scope` — the abstract data context in which to execute the expression (`null`
  if the attribute is not inside a custom element's view);
* `vm` — the viewmodel of the custom element hosting the attribute (`null` if
  the element is not custom).

Example:

<div class="code-pair">
<pre highlight.typescript>
import {Attribute, assign} from 'atril';

@Attribute({attributeName: 'my-attr'})
class Ctrl {
  @assign element: Element;
  @assign attribute: Attr;
  @assign hint: string;
  @assign expression: Function;
  @assign scope: any;
  @assign vm: any;

  constructor() {
    // <hello-world my-attr.calc="2 + 2"></hello-world>
    console.log(element);
    // my-attr.calc="2 + 2"
    console.log(attribute);
    // 'calc'
    console.log(hint);
    // function that returns 4
    console.log(expression);
    // outer viewmodel or null
    console.log(scope);
    // hello-world's viewmodel
    console.log(vm);
  }
}
</pre>

<pre highlight.html>
<hello-world my-attr.calc="2 + 2"></hello-world>
</pre>
</div>

<div>
  <sf-collapse class="info">
    <input id="assign-es5" type="checkbox">
    <label for="assign-es5" class="pad">
      <sf-icon svg-icon.="info-circle" class="inline text-info"></sf-icon>
      Click for ES5 version.
    </label>
<pre highlight.javascript>
var Attribute = require('atril').Attribute;

Attribute({attributeName: 'my-attr'})(function() {
  function Ctrl() {}

  // Property names to the left, dependency tokens to the right.
  Ctrl.assign = {
    element: 'element',
    attribute: 'attribute',
    hint: 'hint',
    expression: 'expression',
    scope: 'scope',
    vm: 'vm'
  };

  return Ctrl;
}());
</pre>
  </sf-collapse>
</div>

### Lifecycle

An attribute's life begins with a `constructor` call. In addition, it can define
two lifecycle methods: `onPhase` and `onDestroy`.

* `onPhase`

This is called whenever the framework reflows the tree of components and
bindings in response to user activity. For an example, see the
[`class.*`](attribute/#basics) implementation above.

* `onDestroy`

When the root of this virtual DOM branch is irrevocably removed from the
hierarchy, this method is invoked on all components, attributes, and molds. You
can use this as a chance to free memory or perform other cleanup tasks. Example:

```typescript
class Ctrl {
  constructor() {
    createWastefulResource();
  }

  onDestroy() {
    deleteWastefulResource();
  }
}
```
