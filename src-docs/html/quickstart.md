## Quickstart

The quickest way to get started is by using the source of [this very
site](https://github.com/Mitranim/atril) as your demo project.

Clone and start it by running the following commands:

```sh
git clone https://github.com/Mitranim/atril.git atril-demo
cd atril-demo
npm run install-all
npm start
```

This will the site and run it locally. It's a multi page app mostly rendered
with `atril`. Ruffle through `src-docs/app` to see how to add custom components.

The rest of this article assumes you have the app running, but we'll briefly
overview some setup basics.

## Quicklinks

* [Installation](quickstart/#installation)
* [Build](quickstart/#build)
* [Component](quickstart/#component)

## Installation

Get it with `npm` or [`jspm`](http://jspm.io).

```sh
npm i --save atril
# or
jspm install npm:atril
# or
jspm install atril=github:Mitranim/atril
```

Or just grab the source from [GitHub](https://github.com/Mitranim/atril), and
don't forget to star the project. :)

Then import it in your application, using your module loader of choice
(SystemJS, RequireJS, browserify, webpack, etc.).

ES5 with CommonJS:

```javascript
// Import everything
var atril = require('atril');
// Import piecemeal
var Component = require('atril').Component;
```

ES6 with SystemJS:

```typescript
// Import everything
import * as atril from 'atril';
// Import piecemeal
import {Component} from 'atril';
```

## Build

This is the typical folder structure for a project of this kind.

```sh
dist ─── ...
src  ─┬─ app
      │   ├─ app.ts
      │   ├─ ...
      │   └─ my-component
      │              ├─ my-component.html
      ├─ html        └─ my-component.ts
      ├─ styles
      └─ ...
```

In development mode, you have a build system that continuously compiles scripts,
views, templates, styles and images, and outputs them into `dist`, from where
the application is served.

For production, you bundle scripts and views, minify all your files, output this
into `dist`, and deploy that folder. `.html` views are converted into `.js`
and included into the script bundle.

The documentation repo includes tasks and scripts for production builds. See
`package.json` and `gulpfile.js`.

## Component

Let's make an obligatory todo demo — the "hello world" of custom elements.
Assuming you have the site running, create `src/html/todo.html` with the
following content:

```html
<!-- src/html/todo.html -->

<todo-list></todo-list>
```

Navigate to this page in your browser.

Create `src/app/todo-list/` with the following:

<div class="code-pair">
<pre highlight.typescript>
// src/app/todo-list/todo-list.ts

import {Component} from 'atril';

@Component({
  tagName: 'todo-list'
})
class VM {
  text = '';
  items = [
    {text: 'Learn a new framework', completed: true},
    {text: 'Be awesome'}
  ];
  newItem = {text: '', completed: false};

  add() {
    this.items.unshift(this.newItem);
    this.newItem = {text: '', completed: false};
  }

  remove(item) {
    this.items.splice(this.items.indexOf(item), 1);
  }

  static viewUrl = 'app/todo-list/todo-list.html';
}
</pre>

<pre highlight.html>
<!-- src/app/todo-list/todo-list.html -->

<todo-item bind.item="newItem" bind.is-new="true" on.add="add()"></todo-item>

<todo-item for.item.of="items" bind.item="item" on.remove="remove(item)"></todo-item>
</pre>
</div>

<div>
  <sf-collapse class="info pad-ch">
    <input id="quickstart-es5" type="checkbox">
    <label for="quickstart-es5">
      <sf-icon svg-icon.="info-circle" class="inline text-info"></sf-icon>
      Click for ES5 version.
    </label>
    <div class="space-out-v">
      <p>Same component in plain old EcmaScript 5.</p>

<pre highlight.javascript>
var Component = require('atril').Component;

Component({tagName: 'todo-list'})(function() {
  function VM() {
    this.text = '';
    this.items = [
      {text: 'Learn a new framework', completed: true},
      {text: 'Be awesome'}
    ];
    this.newItem = {text: '', completed: false}
  }

  VM.prototype.add = function() {
    this.items.unshift(this.newItem);
    this.newItem = {text: '', completed: false}
  };

  VM.prototype.remove = function(item) {
    this.items.splice(this.items.indexOf(item), 1);
  };

  VM.viewUrl = 'app/todo-list/todo-list.html';

  return VM;
}());
</pre>

    </div>
  </sf-collapse>
</div>

This will display nothing, because we don't have a custom `todo-item` element
yet. Let's create it.

Make `src/app/todo-item/` with the following:

<div class="code-pair">
<pre highlight.typescript>
// src/app/todo-item/todo-item.ts

import {Component, bindable} from 'atril';

@Component({
  tagName: 'todo-item'
})
class VM {
  @bindable item = null;
  @bindable isNew = false;

  element: HTMLElement;

  add() {
    this.element.dispatchEvent(new CustomEvent('add'));
  }

  remove() {
    this.element.dispatchEvent(new CustomEvent('remove'));
  }

  static viewUrl = 'app/todo-item/todo-item.html';
}
</pre>
<pre highlight.html>
<!-- src/app/todo-item/todo-item.html -->

<div class.success="item.completed" class.strikethrough="item.completed"
     class.info="!item.completed" class.orange="isNew">
  <label if.="!isNew">
    <input twoway.checked="item.completed" type="checkbox">
  </label>
  <form on.submit="add()" onsubmit="return false">
    <input twoway.value="item.text" bind.disabled="item.completed" required>
    <button if.="isNew" svg-icon.="plus"></button>
  </form>
  <button on.click="remove()" if.="!isNew" svg-icon.="times"></button>
</div>
</pre>
</div>

<div>
  <sf-collapse class="info pad-ch">
    <input id="quickstart-es5-todo-item" type="checkbox">
    <label for="quickstart-es5-todo-item">
      <sf-icon svg-icon.="info-circle" class="inline text-info"></sf-icon>
      Click for ES5 version.
    </label>
    <div class="space-out-v">
      <p>Same component in plain old EcmaScript 5.</p>

<pre highlight.javascript>
var Component = require('atril').Component;

Component({tagName: 'todo-item'})(function() {
  function VM() {
    this.item = null;
    this.isNew = false;
  }

  VM.bindable = ['item', 'isNew'];

  VM.prototype.add = function() {
    this.element.dispatchEvent(new CustomEvent('add'));
  };

  VM.prototype.remove = function() {
    this.element.dispatchEvent(new CustomEvent('remove'));
  };

  VM.viewUrl = 'app/todo-item/todo-item.html';

  return VM;
}());
</pre>

    </div>
  </sf-collapse>
</div>

<div>
  <sf-collapse class="info pad-ch">
    <input id="quickstart-views" type="checkbox">
    <label for="quickstart-views">
      <sf-icon svg-icon.="info-circle" class="inline text-info"></sf-icon>
      Note on views.
    </label>
    <div class="space-out-v">
      <p>
        This component specifies its view as `viewUrl`. The view can also be
        specified inline as the static class property `view` (great with
        <a href="https://github.com/systemjs/plugin-text">SystemJS/text</a>),
        or return a promise that resolves to a view.
      </p>
    </div>
  </sf-collapse>
</div>

To activate these elements on the page, you need to:
1. Import the components in your source.
2. Call `atril.bootstrap()`. This is done once for the entire application. You
   can optionally pass a DOM element as an argument, and the framework will
   start search for `atril` features from that element, ignoring the rest.

Your core `app.ts` file would look something like this:

```typescript
import {bootstrap} from 'atril';
import 'todo-item/todo-item';
import 'todo-list/todo-list';
atril.bootstrap();
```

If the document isn't yet available, the framework will defer bootstrapping
until it's loaded.

Now open the page and see the component in action ([demo](todo/)).

## Data Flow

A few notes on the data flow. Components generally interoperate in three ways.

1. One-way binding from parent to child. Can use arbitrary expressions.

```html
<inner-child bind.child-property="parentProperty || somethingElse"></inner-child>
```

2. Two-way binding between parent and child.

```html
<inner-child twoway.child-property="parentProperty"></inner-child>
```

3. Event-based feedback from child to parent.

```html
<inner-child on.child-event="parentMethod($event.detail)"></inner-child>
```

The todo example uses all three. It's generally best to bind custom components
one-way and feed the data back through events. For form inputs, two-way
databinding is a good fit.

Another thing to note is that `bind` and `twoway` pull double duty. They bind to
properties on the target DOM element, and if it happens to be a custom element
with a viewmodel, also try to bind to that viewmodel's properties.

To avoid surprises, the child component has to declare which properties are
bindable. The `list-item` example shows how to do this with the `@bindable`
decorator or in plain ES5.

----

That's it! In a few lines, you have an interactive, data driven micro
application built out of reusable elements ([demo](todo/)). Check the
site's source for more examples, and stay tuned for documentation on custom
attributes and molds.
