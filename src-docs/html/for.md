## `for.*`

Clones an element over an iterable, making individual items available under the
given key.

```html
<div let.numbers="[1, 2, 3, 4, 5]">
  <button on.click="numbers.pop()">-</button>
  <button on.click="numbers.push((numbers[numbers.length-1]|0)+1)">+</button>
  <span for.num="numbers">{{num}}</span>
</div>
```

<template doc-demo.>
  <div let.numbers="[1, 2, 3, 4, 5]" class="pad-ch space-out-v">
    <button on.click="numbers.pop()">-</button>
    <button on.click="numbers.push((numbers[numbers.length-1]|0)+1)" style="margin-right: 0.5rem">+</button>
    <span for.num="numbers" class="info">{{num}}</span>
  </div>
</template>

Use it on several elements at once with `template`:

```html
<div let.numbers="[1, 2, 3, 4, 5]">
  <button on.click="numbers.pop()">-</button>
  <button on.click="numbers.push((numbers[numbers.length-1]|0)+1)">+</button>
  <template for.num="numbers">
    <span>#</span>
    <span>{{num}}</span>
  </template>
</div>
```

<template doc-demo.>
  <div let.numbers="[1, 2, 3, 4, 5]" class="pad-ch space-out-v">
    <button on.click="numbers.pop()">-</button>
    <button on.click="numbers.push((numbers[numbers.length-1]|0)+1)" style="margin-right: 0.5rem">+</button>
    <template for.num="numbers">
      <span class="success">#</span>
      <span class="info">{{num}}</span>
    </template>
  </div>
</template>

The individual indices or keys are available under the `$index` identifier.

By default, this chooses the iteration strategy depending on the type of the
iterable. Arrays and strings are iterated via `for (;;;)`, and hash tables are
iterated via `for..in`. You can enforce one or the other via `for.X.of` and
`for.X.in`.

### `for.X.of`

```html
<div let.words="['one', 'two', 'three']">
  <span for.word.of="words">{{word}}@{{$index}}</span>
</div>
```

<template doc-demo.>
  <div let.words="['one', 'two', 'three']" class="pad-ch pad-v space-out-v">
    <span for.word.of="words" class="info">{{word}}@{{$index}}</span>
  </div>
</template>

### `for.X.in`

```html
<div let.words="{first: 'one', second: 'two', third: 'three'}">
  <span for.word.in="words">{{word}}@{{$index}}</span>
</div>
```

<template doc-demo.>
  <div let.words="{first: 'one', second: 'two', third: 'three'}" class="pad-ch pad-v space-out-v">
    <span for.word.in="words" class="info">{{word}}@{{$index}}</span>
  </div>
</template>
