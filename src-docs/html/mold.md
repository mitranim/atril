# Mold

A mold provides "admin access" to that part of the virtual DOM. In return, it's
not allowed to touch the real DOM. It has access to the surrounding scope (the
viewmodel), but doesn't create its own.

```typescript
import {Mold} from 'atril';

@Mold({attributeName: 'highlight'})
class Highlight {
  constructor() {
    console.log(this.element);
  }
}
```
