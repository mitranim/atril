var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};System.register(['atril'], function(exports_1) {
    var atril_1;
    var Ctrl;
    return {
        setters:[
            function (_atril_1) {
                atril_1 = _atril_1;
            }],
        execute: function() {
            /**
             * SVG icon helper with optional async loading.
             */
            Ctrl = (function () {
                function Ctrl() {
                    var _this = this;
                    this.content = this.element.content;
                    var path = 'app/svg/' + this.attribute.value + '.svg';
                    var view = atril_1.viewCache.get(path);
                    if (typeof view === 'string')
                        this.commit(view);
                    else {
                        atril_1.viewCache.load(path).then(function (view) { _this.commit(view); });
                    }
                }
                Ctrl.prototype.commit = function (view) {
                    var child = this.content.firstChild;
                    this.element.appendChild(this.content.removeChild(child));
                    if (child.tagName !== 'SF-ICON')
                        child.classList.add('sf-icon');
                    child.innerHTML = view;
                };
                __decorate([
                    atril_1.assign
                ], Ctrl.prototype, "attribute");
                __decorate([
                    atril_1.assign
                ], Ctrl.prototype, "hint");
                __decorate([
                    atril_1.assign
                ], Ctrl.prototype, "element");
                Ctrl = __decorate([
                    atril_1.Mold({
                        attributeName: 'svg-icon'
                    })
                ], Ctrl);
                return Ctrl;
            })();
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vbGRzL3N2Zy1pY29uLnRzIl0sIm5hbWVzIjpbIkN0cmwiLCJDdHJsLmNvbnN0cnVjdG9yIiwiQ3RybC5jb21taXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7WUFFQSxBQUdBOztlQURHOztnQkFXREE7b0JBVkZDLGlCQTJCQ0E7b0JBaEJHQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQTtvQkFDcENBLElBQUlBLElBQUlBLEdBQUdBLFVBQVVBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEdBQUdBLE1BQU1BLENBQUNBO29CQUV0REEsSUFBSUEsSUFBSUEsR0FBR0EsaUJBQVNBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO29CQUMvQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsSUFBSUEsS0FBS0EsUUFBUUEsQ0FBQ0E7d0JBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLENBQUNBO29CQUNoREEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7d0JBQ0pBLGlCQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFBQSxJQUFJQSxJQUFLQSxLQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFBQSxDQUFBQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDekRBLENBQUNBO2dCQUNIQSxDQUFDQTtnQkFFREQscUJBQU1BLEdBQU5BLFVBQU9BLElBQVlBO29CQUNqQkUsSUFBSUEsS0FBS0EsR0FBZ0JBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFVBQVVBLENBQUNBO29CQUNqREEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzFEQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxPQUFPQSxLQUFLQSxTQUFTQSxDQUFDQTt3QkFBQ0EsS0FBS0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2hFQSxLQUFLQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSxDQUFDQTtnQkFDekJBLENBQUNBO2dCQXRCREY7b0JBQUNBLGNBQU1BO21CQUFDQSwyQkFBU0EsRUFBT0E7Z0JBQ3hCQTtvQkFBQ0EsY0FBTUE7bUJBQUNBLHNCQUFJQSxFQUFTQTtnQkFDckJBO29CQUFDQSxjQUFNQTttQkFBQ0EseUJBQU9BLEVBQXNCQTtnQkFOdkNBO29CQUFDQSxZQUFJQSxDQUFDQTt3QkFDSkEsYUFBYUEsRUFBRUEsVUFBVUE7cUJBQzFCQSxDQUFDQTt5QkF5QkRBO2dCQUFEQSxXQUFDQTtZQUFEQSxDQTNCQSxBQTJCQ0EsSUFBQSIsImZpbGUiOiJtb2xkcy9zdmctaWNvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TW9sZCwgYXNzaWduLCB2aWV3Q2FjaGV9IGZyb20gJ2F0cmlsJztcblxuLyoqXG4gKiBTVkcgaWNvbiBoZWxwZXIgd2l0aCBvcHRpb25hbCBhc3luYyBsb2FkaW5nLlxuICovXG5ATW9sZCh7XG4gIGF0dHJpYnV0ZU5hbWU6ICdzdmctaWNvbidcbn0pXG5jbGFzcyBDdHJsIHtcbiAgQGFzc2lnbiBhdHRyaWJ1dGU6IEF0dHI7XG4gIEBhc3NpZ24gaGludDogc3RyaW5nO1xuICBAYXNzaWduIGVsZW1lbnQ6IEhUTUxUZW1wbGF0ZUVsZW1lbnQ7XG5cbiAgY29udGVudDogRG9jdW1lbnRGcmFnbWVudDtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLmVsZW1lbnQuY29udGVudDtcbiAgICBsZXQgcGF0aCA9ICdhcHAvc3ZnLycgKyB0aGlzLmF0dHJpYnV0ZS52YWx1ZSArICcuc3ZnJztcblxuICAgIGxldCB2aWV3ID0gdmlld0NhY2hlLmdldChwYXRoKTtcbiAgICBpZiAodHlwZW9mIHZpZXcgPT09ICdzdHJpbmcnKSB0aGlzLmNvbW1pdCh2aWV3KTtcbiAgICBlbHNlIHtcbiAgICAgIHZpZXdDYWNoZS5sb2FkKHBhdGgpLnRoZW4odmlldyA9PiB7dGhpcy5jb21taXQodmlldyl9KTtcbiAgICB9XG4gIH1cblxuICBjb21taXQodmlldzogc3RyaW5nKTogdm9pZCB7XG4gICAgbGV0IGNoaWxkID0gPEhUTUxFbGVtZW50PnRoaXMuY29udGVudC5maXJzdENoaWxkO1xuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRlbnQucmVtb3ZlQ2hpbGQoY2hpbGQpKTtcbiAgICBpZiAoY2hpbGQudGFnTmFtZSAhPT0gJ1NGLUlDT04nKSBjaGlsZC5jbGFzc0xpc3QuYWRkKCdzZi1pY29uJyk7XG4gICAgY2hpbGQuaW5uZXJIVE1MID0gdmlldztcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9