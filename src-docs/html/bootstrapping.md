## Bootstrapping

After registering all custom elements and attributes, you need to tell the
framework to find and activate them on the page. This is done with the
`bootstrap` method.

```typescript
import {bootstrap} from 'atril';

import 'my-custom-element';
import 'my-attributes';
import 'my-molds';

bootstrap();
```

If the document is already available, `bootstrap` is synchronous. Otherwise it
delays activation until the `DOMContentReady` event. If your scripts are loaded
before the content, activation happens before the content is first rendered by
the browser.

You can optionally pass a DOM element to limit the scope of the search. By
default, search starts with `document.body`.

```typescript
bootstrap(document.querySelector('#limited-section'));
```
