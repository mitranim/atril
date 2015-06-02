import {compileNode} from './compile';

export class View {
  VM: ComponentClass;
  loading: boolean = false;
  failed: boolean = false;

  constructor(VM: ComponentClass) {
    this.VM = VM;
  }

  tryToCompile(virtual: Element): void {
    if (this.loading) return;

    let view: any = this.VM.view;
    if (typeof view === 'string') {
      this.compileView(view, virtual);
      return;
    }

    let url: any = this.VM.viewUrl;
    if (typeof url === 'string' && url) {
      let view = this.getViewByUrl(url, virtual);
      if (typeof view === 'string') this.compileView(view, virtual);
      return;
    }

    this.compileView('', virtual);
  }

  compileView(view: string, virtual: Element): void {
    virtual.innerHTML = view;
    compileNode(virtual);
  }

  loadViewFromPromise(promise: Promise, virtual: Element): void {
    this.loading = true;
    promise
      .then((result: any) => {
        this.loading = false;
        if (typeof result === 'string') {
          this.compileView(result, virtual);
          return;
        }
        console.warn('expected a view promise to resolve to a string, got:', result);
        return Promise.reject(`expected a view promise to resolve to a string, got: ${result}`);
      })
      .catch(err => {
        this.loading = false;
        this.failed = true;
        return Promise.reject(err);
      });
  }

  getViewByUrl(url: string, virtual: Element): string|void {
    let view = viewCache.get(url);
    if (view) return view;
    this.loadViewFromPromise(viewCache.load(url), virtual);
  }
}

export const viewCache = {
  private views: <{[url: string]: string}>Object.create(null),
  private promises: <{[url: string]: Promise}>Object.create(null),

  get(url: string): string|void {
    return viewCache.views[url] || undefined;
  },

  set(url: string, view: string): void {
    console.assert(typeof view === 'string',
                   'a view must be a string, received:', view);
    viewCache.views[url] = view;
  },

  // zone.js ensures the availability of the global Promise constructor.
  load(url: string): Promise {
    if (viewCache.promises[url]) return viewCache.promises[url];

    if (viewCache.views[url]) {
      let promise = Promise.resolve(viewCache.views[url]);
      viewCache.promises[url] = promise;
      return promise;
    }

    return viewCache.promises[url] = new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();

      function fail(): void {
        let msg = `failed to load view for url ${url}`;
        console.warn(msg);
        reject(msg);
      }

      function ok(): void {
        if (!(xhr.status >= 200) || !(xhr.status <= 299)) {
          return fail();
        }

        let result = xhr.responseText;

        if (/application\/json/.test(xhr.getResponseHeader('Content-Type'))) {
          try {
            let value = JSON.parse(result);
            if (typeof value === 'string') result = value;
            else return fail();
          } catch (err) {return fail()}
        }

        viewCache.set(url, result);
        resolve(result);
      }

      xhr.onabort = xhr.onerror = xhr.ontimeout = fail;
      xhr.onload = ok;

      xhr.open('GET', url, true);
      xhr.send();
    });
  }
};
