## Quicklinks

* [Installation](#installation)
* [Usage](#usage)
* ...

## Installation

To begin, get `atril` from GitHub or NPM. You can install it with `npm` or
`jspm` (package manager that replaces `bower`).

```sh
npm i --save atril
# or
jspm install npm:atril
# or
jspm install atril=github:Mitranim/atril
```

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

## Usage

There are three steps to creating an `atril` component.
1. Give it logic. In ES5, any function. In ES6, a class.
2. Give it an HTML template.
3. Include it on the page.

This applies equally to `Component`, `Attribute`, and `Mold`.

After all components are registered, call `atril.bootstrap()`. This is done just
once. You can call `bootstrap()` again after including additional components to
the page (e.g. by manually adding them to the DOM). Existing components will be
ignored.
