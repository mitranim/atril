## `ref.*`

References the target in the current viewmodel or scope. Useful for getting hold
of things in the view.

### `ref.="X"`

Assigns the element as `X`.

<pre highlight.html>
<p ref.="p">Reference me!</p>
<p>{{p.outerHTML}}</p>
</pre>

<template doc-demo.>
<p ref.="p">Reference me!</p>
<p>{{p.outerHTML}}</p>
</template>

### `ref.vm="X"`

Assigns the element's viewmodel as `X`.

<pre highlight.html>
<hello-world ref.vm="viewmodel" style="display: none"></hello-world>
<p>{{viewmodel.name}}</p>
</pre>

<template doc-demo.>
<hello-world ref.vm="viewmodel" style="display: none"></hello-world>
<p>{{viewmodel.name}}</p>
</template>
