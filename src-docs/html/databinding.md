## Databinding

The library has one-way and two-way databinding. They're implemented as custom
attributes, and you can add your own binding types.

### `bind.*`

One-way binding. Generally more efficient than [two-way](databinding/#-twoway-)
binding and is therefore recommended for the majority of data bingings outside
inputs.

Binds a property of the target element, such as `hidden`, to an expression
evaluated against the surrounding scope (usually a [viewmodel](component/)). If
the target element has its own viewmodel (in other words, it's a custom
element), its property is also bound. See [`@bindable`](databinding/#-bindable-)
below.

This works for nested properties like `style.background-color`. Properties that
are `camelCased` in JS must be `kebab-cased` in the attribute. To sync the value
in the other direction, use an event handler with the built-in `on.*` attribute.

Example:

```html
<!-- Bind a nested property -->
<p bind.style.background-color="color">My background color is: {{color}}</p>
<input bind.value="color" on.input="color = this.value">
```

<template doc-demo. let.color="''">
  <p bind.style.background-color="color" class="pad-v-05">My background color is: {{color}}</p>
  <input bind.value="color" on.input="color = this.value" placeholder="try `orange`">
</template>

### `twoway.*`

Two-way binding. For known input types, this is equally as efficient as one-way
binding. Recommended for form inputs.

Binds a property of the target element, such as `hidden` or
`style.background-color`, to a property in the current scope / current
viewmodel. Just like `bind.*`, it also binds the same property of the target
element's [viewmodel](component/), if any; see
[`@bindable`](databinding/#-bindable-). `twoway.*` automatically syncs these
properties between each other.

```html
<p>My name is: {{name}}</p>
<input twoway.value="name">
```

<template doc-demo. let.name="''">
  <p>My name is: {{name}}</p>
  <input twoway.value="name" placeholder="type name here...">
</template>

### `@bindable`

Declares a viewmodel property as bindable, so it can be set from the outside
via `bind.*` or `twoway.*`.

```typescript
import {Component, bindable} from 'atril';

@Component({tagName: 'my-element'})
class ViewModel {
  @bindable myProperty;
}
```

<!--: <sf-collapse class="info">
  <input id="es5-example" type="checkbox">
  <label for="es5-example" class="pad">
    <sf-icon svg-icon.="question-circle" class="inline text-info"></sf-icon>
    Click for ES5 example.
  </label> :-->
```javascript
var Component = require('atril').Component;

Component({tagName: 'my-element'})(ViewModel);

function ViewModel() {}

ViewModel.bindable = ['myProperty'];
```
<!--: </sf-collapse> :-->

Then you can bind that property from the outside:

```html
<my-element bind.my-property="outerProperty"></my-element>
```
