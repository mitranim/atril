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
            Ctrl = (function () {
                function Ctrl() {
                    console.assert(!this.hint, "'doc-demo.' doesn't expect any hints, got: " + this.hint);
                    // Fork the scope. Useful for avoiding `let` conflicts in demos. Not
                    // recommended for other scenarios.
                    var state = atril_1.getOrAddState(this.element);
                    if (!this.scope)
                        this.scope = null;
                    if (!state.scope) {
                        state.scope = Object.create(this.scope);
                        this.scope = state.scope;
                    }
                    // Add a demo wrapper.
                    var div = document.createElement('div');
                    div.classList.add('doc-demo');
                    div.innerHTML =
                        "<p>\n        <sf-icon svg-icon.=\"info-circle\" class=\"inline text-info\"></sf-icon>\n        Demo\n      </p>";
                    var fragment = this.element.content;
                    while (fragment.hasChildNodes()) {
                        div.appendChild(fragment.removeChild(fragment.firstChild));
                    }
                    this.element.appendChild(div);
                }
                Ctrl = __decorate([
                    atril_1.Mold({
                        attributeName: 'doc-demo'
                    })
                ], Ctrl);
                return Ctrl;
            })();
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vbGRzL2RvYy1kZW1vLnRzIl0sIm5hbWVzIjpbIkN0cmwiLCJDdHJsLmNvbnN0cnVjdG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O1lBRUE7Z0JBU0VBO29CQUNFQyxPQUFPQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxnREFBOENBLElBQUlBLENBQUNBLElBQU1BLENBQUNBLENBQUNBO29CQUV0RkEsQUFFQUEsb0VBRm9FQTtvQkFDcEVBLG1DQUFtQ0E7d0JBQy9CQSxLQUFLQSxHQUFHQSxxQkFBYUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3hDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQTt3QkFBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0E7b0JBQ25DQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDakJBLEtBQUtBLENBQUNBLEtBQUtBLEdBQUdBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO3dCQUN4Q0EsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0E7b0JBQzNCQSxDQUFDQTtvQkFFREEsQUFDQUEsc0JBRHNCQTt3QkFDbEJBLEdBQUdBLEdBQUdBLFFBQVFBLENBQUNBLGFBQWFBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO29CQUN4Q0EsR0FBR0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7b0JBQzlCQSxHQUFHQSxDQUFDQSxTQUFTQTt3QkFDWEEsaUhBR0tBLENBQUNBO29CQUVSQSxJQUFJQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQTtvQkFDcENBLE9BQU9BLFFBQVFBLENBQUNBLGFBQWFBLEVBQUVBLEVBQUVBLENBQUNBO3dCQUNoQ0EsR0FBR0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzdEQSxDQUFDQTtvQkFDREEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2hDQSxDQUFDQTtnQkFuQ0hEO29CQUFDQSxZQUFJQSxDQUFDQTt3QkFDSkEsYUFBYUEsRUFBRUEsVUFBVUE7cUJBQzFCQSxDQUFDQTt5QkFrQ0RBO2dCQUFEQSxXQUFDQTtZQUFEQSxDQXBDQSxBQW9DQ0EsSUFBQSIsImZpbGUiOiJtb2xkcy9kb2MtZGVtby5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TW9sZCwgZ2V0T3JBZGRTdGF0ZX0gZnJvbSAnYXRyaWwnO1xuXG5ATW9sZCh7XG4gIGF0dHJpYnV0ZU5hbWU6ICdkb2MtZGVtbydcbn0pXG5jbGFzcyBDdHJsIHtcbiAgLy8gQXV0b2Fzc2lnbmVkXG4gIGVsZW1lbnQ6IEhUTUxUZW1wbGF0ZUVsZW1lbnQ7XG4gIGhpbnQ6IHN0cmluZztcbiAgc2NvcGU6IGFueTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBjb25zb2xlLmFzc2VydCghdGhpcy5oaW50LCBgJ2RvYy1kZW1vLicgZG9lc24ndCBleHBlY3QgYW55IGhpbnRzLCBnb3Q6ICR7dGhpcy5oaW50fWApO1xuXG4gICAgLy8gRm9yayB0aGUgc2NvcGUuIFVzZWZ1bCBmb3IgYXZvaWRpbmcgYGxldGAgY29uZmxpY3RzIGluIGRlbW9zLiBOb3RcbiAgICAvLyByZWNvbW1lbmRlZCBmb3Igb3RoZXIgc2NlbmFyaW9zLlxuICAgIGxldCBzdGF0ZSA9IGdldE9yQWRkU3RhdGUodGhpcy5lbGVtZW50KTtcbiAgICBpZiAoIXRoaXMuc2NvcGUpIHRoaXMuc2NvcGUgPSBudWxsO1xuICAgIGlmICghc3RhdGUuc2NvcGUpIHtcbiAgICAgIHN0YXRlLnNjb3BlID0gT2JqZWN0LmNyZWF0ZSh0aGlzLnNjb3BlKTtcbiAgICAgIHRoaXMuc2NvcGUgPSBzdGF0ZS5zY29wZTtcbiAgICB9XG5cbiAgICAvLyBBZGQgYSBkZW1vIHdyYXBwZXIuXG4gICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdkb2MtZGVtbycpO1xuICAgIGRpdi5pbm5lckhUTUwgPVxuICAgICAgYDxwPlxuICAgICAgICA8c2YtaWNvbiBzdmctaWNvbi49XCJpbmZvLWNpcmNsZVwiIGNsYXNzPVwiaW5saW5lIHRleHQtaW5mb1wiPjwvc2YtaWNvbj5cbiAgICAgICAgRGVtb1xuICAgICAgPC9wPmA7XG5cbiAgICBsZXQgZnJhZ21lbnQgPSB0aGlzLmVsZW1lbnQuY29udGVudDtcbiAgICB3aGlsZSAoZnJhZ21lbnQuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoZnJhZ21lbnQucmVtb3ZlQ2hpbGQoZnJhZ21lbnQuZmlyc3RDaGlsZCkpO1xuICAgIH1cbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9