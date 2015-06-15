## Mold

<div class="info pad decorate-links">
  <p>Quicklinks</p>
  <ul>
    <li><a href="mold/#basics">Basics</a></li>
    <li><a href="mold/#mutation">Mutation</a></li>
    <li><a href="mold/#optimisation">Optimisation</a></li>
    <li><a href="mold/#contextual-dependencies">Contextual Dependencies</a></li>
    <li><a href="mold/#lifecycle">Lifecycle</a></li>
  </ul>
</div>

Molds let you modulate the structure of the virtual DOM. They fill the  role
between custom elements that can only _define_ the view, and custom attributes
that can only modify _existing_ DOM nodes.

In essense, a mold gives you "admin access" to the part of the virtual DOM
enclosed by it. Example of a mold in practice:

```html
<label>
  <input twoway.checked="checked" type="checkbox">
  <span>Toggle</span>
</label>

<!-- Conditional rendering -->
<template if.="checked">
  <p>I'm included into the DOM conditionally.</p>
</template>
```

<template doc-demo.>
<div>
  <label>
    <input twoway.checked="checked" type="checkbox">
    <span>Toggle</span>
  </label>
</div>
<template if.="checked">
  <p>I'm included into the DOM conditionally.</p>
</template>
</template>

The mold (in this case, the controller of the [`if.`](if/) attribute) decides
what to with the content caught inside the template tag (in this case, the
`<p>`). It could ignore the content, clone and multiply it, or replace it with
something else entirely.

In this case, the `if.` attribute simply includes the content when the condition
is met, and removes it when not.

### Basics

First, let's understand the
HTML5 [`template` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template).
When HMTL is parsed into the virtual DOM, the contents of each `template` tag
are put into the special property `content`. `atril` shims this behaviour in
non-supporting browsers when compiling the DOM.

The mold controller (the class decorated with `@Mold`) has access to its virtual
`template` element. During its `constructor` call or in the lifecycle method
`onPhase` it has a chance to take the mold's initial content, perform arbitrary
transformations, and append the result to the template element itself. The
mold's "output" is the resulting `childNodes` of the template element.

When a mold is constructed, and every time it's phased, the framework checks the
template's contents to see if they need to be recompiled. Any custom elements,
custom attributes, or molds in the output are automatically activated. Then the
contents are synced to the real DOM. The template element itself is not included
into the DOM.

Let's implement a mold that compiles and outputs markdown. Using the demo
project from [Quickstart](quickstart/), create a file `src/app/molds/to-
markdown.ts` with the following.

<!--: <sf-collapse class="info">
  <input id="<%= uniqId() %>" type="checkbox">
  <label for="<%= lastUniqId() %>" class="pad">
    <sf-icon svg-icon.="question-circle" class="inline text-info"></sf-icon>
    Expand code.
  </label> :-->
```typescript
import {Mold, assign} from 'atril';
import marked from 'marked';

@Mold({
  attributeName: 'markdown-live'
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
```
<!--: </sf-collapse> :-->

Then use it in your view like so:

```html
<textarea twoway.value="myContent"></textarea>
<template markdown-live.="myContent"></template>
```

<template doc-demo.>
  <div class="flex space-out-h">
<textarea twoway.value="value" class="flex-1 text-monospace">
<!--:## Mold

Molds let you modulate the structure of the virtual DOM. They fill the role between custom elements that can only _define_ the view, and custom attributes that can only modify _existing_ DOM nodes.

In essense, a mold gives you "admin access" to the part of the virtual DOM enclosed by it. Example:

```html
<template if.="true">
  <p>I'm included into the DOM conditionally.</p>
</template>
```:-->
</textarea>
    <sf-article class="flex-1">
      <template markdown-live.="value"></template>
    </sf-article>
  </div>
</template>

Why go through all this fiddly DOM manipulation? Wouldn't it be easier to just
keep one element in the DOM and replace its `innerHTML` with the compiled
results?

For plain markdown, it would be. However, there's more to it:
* A mold may have any number of children, including zero, and its output is
  automatically included into the correct place in the DOM.
* The mold output is not inert HTML. It's automatically compiled and activated.

Let's see what happens if our markdown contains `atril` markup.

<template doc-demo.>
  <div class="flex space-out-h">
<textarea twoway.value="value" class="flex-1 text-monospace" rows="8">
<!--:<label>
  <input twoway.value="text"
         placeholder="write something...">
</label>

{{text}}:-->
</textarea>
    <sf-article class="flex-1">
      <template markdown-live.="value"></template>
    </sf-article>
  </div>
</template>

The contents of the `template` tag were automatically compiled by the framework
and activated just like a normal part of the view.

### Mutation

More often you want to use a mold to modify _existing_ virtual markup. In the
previous example, we used a separate input to generate the markdown. Now let's
put it directly into the template.

Here's the implementation:

<!--: <sf-collapse class="info">
  <input id="<%= uniqId() %>" type="checkbox">
  <label for="<%= lastUniqId() %>" class="pad">
    <sf-icon svg-icon.="question-circle" class="inline text-info"></sf-icon>
    Expand code.
  </label> :-->
```typescript
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

    while (buffer.hasChildNodes()) {
      this.element.appendChild(buffer.removeChild(buffer.firstChild));
    }
  }
}
```
<!--: </sf-collapse> :-->

Use it in HTML like so:

```html
<template markdown.>
## Header

* list item
* list item
</template>
```

The mold automatically converts its content into markdown, and here's the result:

<template doc-demo.>
<!--: <template markdown.>
## Header

* list item
* list item
</template> :-->
</template>

### Optimisation

By default, the framework automatically recompiles the mold's output (the
contents of the `template` tag). If you create new parts of the virtual DOM
that use `atril` features like custom elements, they will work automatically.

However, this has a performance cost. Because the framework doesn't know which
parts of the virtual DOM you could have modified, it has to scan the entire
subtree. If your mold reuses some parts of its virtual DOM, leaving them
unchanged between phases, you can "hint" the framework not to rescan them.

Excerpt from the `if.` implementation:

```typescript
@Mold({attributeName: 'if'})
class If {
  /* ... */

  constructor() {
      /* ... */
      Meta.getOrAddMeta(child).isDomImmutable = true;
      /* ... */
  }
}
```

The `Meta` object is a metadata container associated with each node in the
virtual DOM tree. The framework adds them automatically when compiling nodes,
but you can also add a meta to a newly created node.

If a node is marked as `isDomImmutable` in its metadata, the framework will
only compile it once, and skip on subsequent reflows. "Immutability" refers
to the inner DOM structure of that virtual element, and doesn't prevent DOM
updates like text interpolations.

By hinting which mold children won't change, you conserve a considerable amount
of performance.

### Contextual Dependencies

The framework uses a variant of dependency injection — _dependency assignment_ —
to give you contextual dependencies for each mold controller. To get hold of
them, use the `@assign` decorator (ES7/TypeScript) or the static `assign`
property on the constructor function (ES5).

A mold has the following contextual dependencies:
* `element` — the virtual `template` element;
* `attribute` — the associated
  [`Attr`](https://developer.mozilla.org/en-US/docs/Web/API/Attr) object on the
  template element;
* `hint` — the part in the attribute name after the dot;
* `expression` — the expression automatically compiled from the attribute value;
* `scope` — the abstract data context in which to execute the expression (`null`
  if the mold is not inside a custom element's view).

Example:

<!--: <div class="code-pair"> :-->
```typescript
import {Mold, assign} from 'atril';

@Mold({attributeName: 'my-mold'})
class Ctrl {
  @assign element: HTMLTemplateElement;
  @assign attribute: Attr;
  @assign hint: string;
  @assign expression: Function;
  @assign scope: any;

  constructor() {
    // <template my-mold.calc="2 + 2"></template>
    console.log(element);
    // my-mold.calc="2 + 2"
    console.log(attribute);
    // 'calc'
    console.log(hint);
    // function that returns 4
    console.log(expression);
    // outer viewmodel or null
    console.log(scope);
  }
}
```

```html
<div my-mold.calc="2 + 2"></div>
```
<!--: </div> :-->

<!--: <sf-collapse class="info">
  <input id="assign-es5" type="checkbox">
  <label for="assign-es5" class="pad">
    <sf-icon svg-icon.="info-circle" class="inline text-info"></sf-icon>
    Click for ES5 version.
  </label> :-->
```javascript
var Mold = require('atril').Mold;

Mold({attributeName: 'my-mold'})(function() {
  function Ctrl() {}

  // Property names to the left, dependency tokens to the right.
  Ctrl.assign = {
    element: 'element',
    attribute: 'attribute',
    hint: 'hint',
    expression: 'expression',
    scope: 'scope'
  };

  return Ctrl;
}());
```
<!--: </sf-collapse> :-->

### Lifecycle

A mold's life begins with a `constructor` call. In addition, it can define two
lifecycle methods: `onPhase` and `onDestroy`.

* `onPhase`

This is called whenever the framework reflows the tree of components and
bindings in response to user activity. For an example, see the
[`markdown-live.*`](mold/#basics) implementation above.

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
