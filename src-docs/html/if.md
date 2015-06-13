## `if.`

Adds the element to the DOM when the condition evaluates to truthy, and removes
it when the condition evaluates to falsy. Example:

```html
<div let.visible="true">
  <button on.click="visible = !visible">Toggle one!</button>
  <div if.="true">I'm always visible!</div>
  <div if.="visible">I'm conditionally visible!</div>
</div>
```

<template doc-demo.>
  <div let.visible="true" class="space-out-v">
    <button on.click="visible = !visible">Toggle one!</button>
    <div if.="true" class="pad success">I'm always visible!</div>
    <div if.="visible" class="pad info">I'm conditionally visible!</div>
  </div>
</template>

Internally, the element is cached while hidden, so adding and removing it is
very cheap.

To hide multiple nodes at once, use it on a `template` tag:

```html
<div let.visible="true">
  <button on.click="visible = !visible">Toggle both!</button>
  <template if.="visible">
    <div>I'm first!</div>
    <div>I'm second!</div>
  </template>
</div>
```

<template doc-demo.>
  <div let.visible="true" class="space-out-v">
    <button on.click="visible = !visible">Toggle both!</button>
    <template if.="visible">
      <div class="pad success">I'm first!</div>
      <div class="pad info">I'm second!</div>
    </template>
  </div>
</template>

### Note

You can also hide an element without removing it from the DOM by binding to its
`hidden` property:

```html
<div let.visible="true">
  <button on.click="visible = !visible">Toggle one!</button>
  <div bind.hidden="false">I'm always visible!</div>
  <div bind.hidden="!visible">I'm conditionally visible!</div>
</div>
```

<template doc-demo.>
  <div let.visible="true" class="space-out-v">
    <button on.click="visible = !visible">Toggle one!</button>
    <div bind.hidden="false" class="pad success">I'm always visible!</div>
    <div bind.hidden="!visible" class="pad info">I'm conditionally visible!</div>
  </div>
</template>
