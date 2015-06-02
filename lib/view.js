var compile_1 = require('./compile');
var View = (function () {
    function View(VM) {
        this.loading = false;
        this.failed = false;
        this.VM = VM;
    }
    View.prototype.tryToCompile = function (virtual) {
        if (this.loading)
            return;
        var view = this.VM.view;
        if (typeof view === 'string') {
            this.compileView(view, virtual);
            return;
        }
        var url = this.VM.viewUrl;
        if (typeof url === 'string' && url) {
            var view_1 = this.getViewByUrl(url, virtual);
            if (typeof view_1 === 'string')
                this.compileView(view_1, virtual);
            return;
        }
        this.compileView('', virtual);
    };
    View.prototype.compileView = function (view, virtual) {
        virtual.innerHTML = view;
        compile_1.compileNode(virtual);
    };
    View.prototype.loadViewFromPromise = function (promise, virtual) {
        var _this = this;
        this.loading = true;
        promise
            .then(function (result) {
            _this.loading = false;
            if (typeof result === 'string') {
                _this.compileView(result, virtual);
                return;
            }
            console.warn('expected a view promise to resolve to a string, got:', result);
            return Promise.reject("expected a view promise to resolve to a string, got: " + result);
        })
            .catch(function (err) {
            _this.loading = false;
            _this.failed = true;
            return Promise.reject(err);
        });
    };
    View.prototype.getViewByUrl = function (url, virtual) {
        var view = exports.viewCache.get(url);
        if (view)
            return view;
        this.loadViewFromPromise(exports.viewCache.load(url), virtual);
    };
    return View;
})();
exports.View = View;
exports.viewCache = {
    views: Object.create(null),
    promises: Object.create(null),
    get: function (url) {
        return exports.viewCache.views[url] || undefined;
    },
    set: function (url, view) {
        console.assert(typeof view === 'string', 'a view must be a string, received:', view);
        exports.viewCache.views[url] = view;
    },
    // zone.js ensures the availability of the global Promise constructor.
    load: function (url) {
        if (exports.viewCache.promises[url])
            return exports.viewCache.promises[url];
        if (exports.viewCache.views[url]) {
            var promise = Promise.resolve(exports.viewCache.views[url]);
            exports.viewCache.promises[url] = promise;
            return promise;
        }
        return exports.viewCache.promises[url] = new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            function fail() {
                var msg = "failed to load view for url " + url;
                console.warn(msg);
                reject(msg);
            }
            function ok() {
                if (!(xhr.status >= 200) || !(xhr.status <= 299)) {
                    return fail();
                }
                var result = xhr.responseText;
                if (/application\/json/.test(xhr.getResponseHeader('Content-Type'))) {
                    try {
                        var value = JSON.parse(result);
                        if (typeof value === 'string')
                            result = value;
                        else
                            return fail();
                    }
                    catch (err) {
                        return fail();
                    }
                }
                exports.viewCache.set(url, result);
                resolve(result);
            }
            xhr.onabort = xhr.onerror = xhr.ontimeout = fail;
            xhr.onload = ok;
            xhr.open('GET', url, true);
            xhr.send();
        });
    }
};
