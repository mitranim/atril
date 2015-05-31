# Draft

A draft provides "admin access" to that part of the virtual DOM. In return, it's
not allowed to touch the real DOM. It has access to the surrounding scope (the
viewmodel), but doesn't create its own.

```typescript
import {Draft} from 'atril';

@Draft({attributeName: 'highlight'})
class Highlight {
  constructor() {
    console.log(this.element);
  }
}
```
