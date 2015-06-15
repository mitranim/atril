## `on.*`

Adds a listener for the given event. Executes the given statement whenever the
event occurs.

The event name is included as the _hint_ (the part after the dot). You can
listen to any events, not just the standard ones.

Example:

<!--: <div class="code-pair"> :-->
```html
<!-- Outer component -->
<inner-component on.my-event="console.log($event.detail)"></inner-component>
```

```html
<!-- Inner component -->
<button on.click="this.dispatchEvent(new CustomEvent('my-event', 'r-r-roar'))"></button>
```
<!--: </div> :-->

When clicked, the outer component will log `r-r-roar`.

`on.*` is similar to the native `onsomething` handlers. It's also executed with
the element as its context (`this`). The main difference is that it evaluates
the expression or statement against the current _viewmodel_ (component), or
against a local scope that inherits from the viewmodel (`for.*` creates local
scopes for cloned items). Native handlers are always evaluated against the
global scope and don't have access to components.

Dispatching events and reacting to events as the paradigm for communicating
between components has been adopted by several major frameworks, including
Angular 2, Aurelia, and Polymer, so give it a go.
