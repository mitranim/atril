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
                    var meta = atril_1.Meta.getMeta(this.element);
                    if (!this.scope)
                        this.scope = null;
                    if (!meta.scope) {
                        meta.insertScope();
                        this.scope = meta.scope;
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
                __decorate([
                    atril_1.assign
                ], Ctrl.prototype, "element");
                __decorate([
                    atril_1.assign
                ], Ctrl.prototype, "hint");
                __decorate([
                    atril_1.assign
                ], Ctrl.prototype, "scope");
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vbGRzL2RvYy1kZW1vLnRzIl0sIm5hbWVzIjpbIkN0cmwiLCJDdHJsLmNvbnN0cnVjdG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O1lBRUE7Z0JBUUVBO29CQUNFQyxPQUFPQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxnREFBOENBLElBQUlBLENBQUNBLElBQU1BLENBQUNBLENBQUNBO29CQUV0RkEsQUFFQUEsb0VBRm9FQTtvQkFDcEVBLG1DQUFtQ0E7d0JBQy9CQSxJQUFJQSxHQUFHQSxZQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtvQkFDdENBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBO3dCQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQTtvQkFDbkNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO3dCQUNoQkEsSUFBSUEsQ0FBQ0EsV0FBV0EsRUFBRUEsQ0FBQ0E7d0JBQ25CQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQTtvQkFDMUJBLENBQUNBO29CQUVEQSxBQUNBQSxzQkFEc0JBO3dCQUNsQkEsR0FBR0EsR0FBR0EsUUFBUUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3hDQSxHQUFHQSxDQUFDQSxTQUFTQSxDQUFDQSxHQUFHQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtvQkFDOUJBLEdBQUdBLENBQUNBLFNBQVNBO3dCQUNYQSxpSEFHS0EsQ0FBQ0E7b0JBRVJBLElBQUlBLFFBQVFBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBO29CQUNwQ0EsT0FBT0EsUUFBUUEsQ0FBQ0EsYUFBYUEsRUFBRUEsRUFBRUEsQ0FBQ0E7d0JBQ2hDQSxHQUFHQSxDQUFDQSxXQUFXQSxDQUFDQSxRQUFRQSxDQUFDQSxXQUFXQSxDQUFDQSxRQUFRQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDN0RBLENBQUNBO29CQUNEQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxXQUFXQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDaENBLENBQUNBO2dCQTlCREQ7b0JBQUNBLGNBQU1BO21CQUFDQSx5QkFBT0EsRUFBc0JBO2dCQUNyQ0E7b0JBQUNBLGNBQU1BO21CQUFDQSxzQkFBSUEsRUFBU0E7Z0JBQ3JCQTtvQkFBQ0EsY0FBTUE7bUJBQUNBLHVCQUFLQSxFQUFNQTtnQkFOckJBO29CQUFDQSxZQUFJQSxDQUFDQTt3QkFDSkEsYUFBYUEsRUFBRUEsVUFBVUE7cUJBQzFCQSxDQUFDQTt5QkFpQ0RBO2dCQUFEQSxXQUFDQTtZQUFEQSxDQW5DQSxBQW1DQ0EsSUFBQSIsImZpbGUiOiJtb2xkcy9kb2MtZGVtby5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TW9sZCwgTWV0YSwgYXNzaWdufSBmcm9tICdhdHJpbCc7XG5cbkBNb2xkKHtcbiAgYXR0cmlidXRlTmFtZTogJ2RvYy1kZW1vJ1xufSlcbmNsYXNzIEN0cmwge1xuICBAYXNzaWduIGVsZW1lbnQ6IEhUTUxUZW1wbGF0ZUVsZW1lbnQ7XG4gIEBhc3NpZ24gaGludDogc3RyaW5nO1xuICBAYXNzaWduIHNjb3BlOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgY29uc29sZS5hc3NlcnQoIXRoaXMuaGludCwgYCdkb2MtZGVtby4nIGRvZXNuJ3QgZXhwZWN0IGFueSBoaW50cywgZ290OiAke3RoaXMuaGludH1gKTtcblxuICAgIC8vIEZvcmsgdGhlIHNjb3BlLiBVc2VmdWwgZm9yIGF2b2lkaW5nIGBsZXRgIGNvbmZsaWN0cyBpbiBkZW1vcy4gTm90XG4gICAgLy8gcmVjb21tZW5kZWQgZm9yIG90aGVyIHNjZW5hcmlvcy5cbiAgICBsZXQgbWV0YSA9IE1ldGEuZ2V0TWV0YSh0aGlzLmVsZW1lbnQpO1xuICAgIGlmICghdGhpcy5zY29wZSkgdGhpcy5zY29wZSA9IG51bGw7XG4gICAgaWYgKCFtZXRhLnNjb3BlKSB7XG4gICAgICBtZXRhLmluc2VydFNjb3BlKCk7XG4gICAgICB0aGlzLnNjb3BlID0gbWV0YS5zY29wZTtcbiAgICB9XG5cbiAgICAvLyBBZGQgYSBkZW1vIHdyYXBwZXIuXG4gICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5jbGFzc0xpc3QuYWRkKCdkb2MtZGVtbycpO1xuICAgIGRpdi5pbm5lckhUTUwgPVxuICAgICAgYDxwPlxuICAgICAgICA8c2YtaWNvbiBzdmctaWNvbi49XCJpbmZvLWNpcmNsZVwiIGNsYXNzPVwiaW5saW5lIHRleHQtaW5mb1wiPjwvc2YtaWNvbj5cbiAgICAgICAgRGVtb1xuICAgICAgPC9wPmA7XG5cbiAgICBsZXQgZnJhZ21lbnQgPSB0aGlzLmVsZW1lbnQuY29udGVudDtcbiAgICB3aGlsZSAoZnJhZ21lbnQuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoZnJhZ21lbnQucmVtb3ZlQ2hpbGQoZnJhZ21lbnQuZmlyc3RDaGlsZCkpO1xuICAgIH1cbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9