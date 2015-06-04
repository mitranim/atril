## `class.*`

Used as `class.X`, this adds class `X` when the expression is truthy and removes
it when the expression evaluates to falsy.

Example:

<pre highlight.html>
<div let.checked="true">
  <label class.info="checked" class.error="!checked">
    <input twoway.checked="checked" type="checkbox">
    <span>I'm checked: {{checked}}</span>
  </label>
</div>
</pre>

<template doc-demo. let.checked="true">
  <div class="pad-v">
    <label class="pad" class.info="checked" class.error="!checked">
      <input twoway.checked="checked" type="checkbox">
      <span>I'm checked: {{checked}}</span>
    </label>
  </div>
</template>
