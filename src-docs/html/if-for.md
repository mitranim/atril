## Overview

Built-in attributes that manipulate the DOM, conditionally adding or removing
nodes.

* [`if.`](#if)
* [`for.*`](#for)

## `if.`

Adds the element to the DOM when the condition evaluates to truthy, and removes
it when the condition evaluates to falsy. Example:

<template doc-demo.>
  <div let.visible="true">
    <button on.click="visible = !visible">Toggle!</button>
    <div if.="visible" class="pad info">I'm first!</div>
    <div if.="!visible" class="pad error">I'm second!</div>
  </div>
</template>

## `for.*`
