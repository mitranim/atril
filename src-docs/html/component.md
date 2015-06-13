## Component

<div class="info pad decorate-links">
  <p>Quicklinks:</p>
  <ul>
    <li><a href="component/#basics">Basics</a></li>
    <li><a href="component/#contextual-dependencies">Contextual Dependencies</a></li>
    <li><a href="component/#lifecycle">Lifecycle</a></li>
  </ul>
</div>

Synonymous with _custom element_. Combines a _view model_ (a data layer) with a
_view_ (an HTML template used for every such element).

The viewmodel class describes how to create a viewmodel object (VM for short)
for each new element of this type. The VM stores arbitrary data and has methods
that may be called from the view. Its acts as its view's local scope — a feature
missing from the native DOM API.

A custom element is registered under a new tag name, and activated during
[bootstrapping](bootstrapping/). Afterwards, `atril` manages the element,
automatically updating the view whenever the data changes.

### Basics

Example custom element:
<div class="code-pair">
<pre highlight.typescript>
// Viewmodel.

import {Component} from 'atril';

@Component({
  tagName: 'hello-world'
})
class ViewModel {
  name = 'world';
  static viewUrl = 'app/hello-world/hello-world.html';
}
</pre>

<pre highlight.html>
<!-- Template. -->

<!-- Updates automatically -->
<h1>Hello, {{name}}!</h1>

<!-- Two-way databinding -->
<input twoway.value="name">

<!-- One-way databinding with manual feedback -->
<input bind.value="name" on.input="name = this.value">

<!-- One-way databinding with no feedback;
     on.input is needed to detect user activity -->
<input bind.value="name" on.input>
</pre>
</div>

<pre highlight.html>
<!-- Usage in HTML -->

<hello-world></hello-world>
</pre>

<template doc-demo.>
  <hello-world></hello-world>
</template>

<div>
  <sf-collapse class="info">
    <input id="es5-example" type="checkbox">
    <label for="es5-example" class="pad">
      <sf-icon svg-icon.="question-circle" class="inline text-info"></sf-icon>
      Click to see example with EcmaScript 5 and CommonJS.
    </label>
    <div class="code-pair">
<pre highlight.javascript>
var Component = require('atril').Component;

Component({
  tagName: 'hello-world'
})(ViewModel);

function ViewModel() {
  this.name = 'world';
}

ViewModel.viewUrl = 'app/hello-world/hello-world.html';
</pre>

<pre highlight.html>
<!-- Updates automatically -->
<h1>Hello, {{name}}!</h1>

<!-- Two-way databinding -->
<input twoway.value="name">

<!-- One-way databinding with manual feedback -->
<input bind.value="name" on.input="name = this.value">

<!-- One-way databinding with no feedback;
     on.input is needed to detect user activity -->
<input bind.value="name" on.input>
</pre>
    </div>
  </sf-collapse>
</div>

### Contextual Dependencies

The framework uses a variant of dependency injection — _dependency assignment_
— to give you contextual dependencies for each viewmodel. To get hold of them,
use the `@assign` decorator (ES7/TypeScript) or the static `assign` property
on the constructor function (ES5).

The component viewmodel has just one dependency: `element`.

```typescript
import {Component, assign} from 'atril';

@Component({tagName: 'my-element'})
class VM {
  @assign element: Element;
  constructor() {
    console.log(this.element);
  }
}
```

You can also use a different property name:

```typescript
import {Component, assign} from 'atril';

@Component({tagName: 'my-element'})
class VM {
  @assign('element') elem: Element;
  constructor() {
    console.log(this.elem);
  }
}
```

<div>
  <sf-collapse class="info">
    <input id="assign-es5" type="checkbox">
    <label for="assign-es5" class="pad">
      <sf-icon svg-icon.="info-circle" class="inline text-info"></sf-icon>
      Click for ES5 version.
    </label>
<pre highlight.javascript>
var Component = require('atril').Component;

Component({tagName: 'my-element'})(function() {
  function VM() {
    console.log(this.elem);
  }

  VM.assign = {elem: 'element'};

  return VM;
}());
</pre>
  </sf-collapse>
</div>

### Lifecycle

A component's life begins with a `constructor` call. In addition, it can define
two lifecycle methods: `onPhase` and `onDestroy`.

* `onPhase`

This is called whenever the framework reflows the tree of components and
bindings in response to user activity. Example usage:

```typescript
class VM {
  @assign element: Element;

  onPhase() {
    let anchor = this.element.querySelector('a');
    if (this.isActive(anchor, location.pathname)) {
      anchor.classList.add('active');
    } else {
      anchor.classList.remove('active');
    }
  }
}
```

* `onDestroy`

When a root of the component hierarchy is removed from the real DOM, this is
called for each descendant component and the root itself. You can use this as a
chance to free memory or perform other cleanup tasks. Example:

```typescript
class VM {
  constructor() {
    createWastefulResource();
  }

  onDestroy() {
    deleteWastefulResource();
  }
}
```
