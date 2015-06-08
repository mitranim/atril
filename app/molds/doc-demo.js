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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vbGRzL2RvYy1kZW1vLnRzIl0sIm5hbWVzIjpbIkN0cmwiLCJDdHJsLmNvbnN0cnVjdG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O1lBRUE7Z0JBU0VBO29CQUNFQyxPQUFPQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxnREFBOENBLElBQUlBLENBQUNBLElBQU1BLENBQUNBLENBQUNBO29CQUV0RkEsQUFFQUEsb0VBRm9FQTtvQkFDcEVBLG1DQUFtQ0E7d0JBQy9CQSxJQUFJQSxHQUFHQSxZQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtvQkFDdENBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBO3dCQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQTtvQkFDbkNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO3dCQUNoQkEsSUFBSUEsQ0FBQ0EsV0FBV0EsRUFBRUEsQ0FBQ0E7d0JBQ25CQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQTtvQkFDMUJBLENBQUNBO29CQUVEQSxBQUNBQSxzQkFEc0JBO3dCQUNsQkEsR0FBR0EsR0FBR0EsUUFBUUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3hDQSxHQUFHQSxDQUFDQSxTQUFTQSxDQUFDQSxHQUFHQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtvQkFDOUJBLEdBQUdBLENBQUNBLFNBQVNBO3dCQUNYQSxpSEFHS0EsQ0FBQ0E7b0JBRVJBLElBQUlBLFFBQVFBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBO29CQUNwQ0EsT0FBT0EsUUFBUUEsQ0FBQ0EsYUFBYUEsRUFBRUEsRUFBRUEsQ0FBQ0E7d0JBQ2hDQSxHQUFHQSxDQUFDQSxXQUFXQSxDQUFDQSxRQUFRQSxDQUFDQSxXQUFXQSxDQUFDQSxRQUFRQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDN0RBLENBQUNBO29CQUNEQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxXQUFXQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDaENBLENBQUNBO2dCQW5DSEQ7b0JBQUNBLFlBQUlBLENBQUNBO3dCQUNKQSxhQUFhQSxFQUFFQSxVQUFVQTtxQkFDMUJBLENBQUNBO3lCQWtDREE7Z0JBQURBLFdBQUNBO1lBQURBLENBcENBLEFBb0NDQSxJQUFBIiwiZmlsZSI6Im1vbGRzL2RvYy1kZW1vLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtNb2xkLCBNZXRhfSBmcm9tICdhdHJpbCc7XG5cbkBNb2xkKHtcbiAgYXR0cmlidXRlTmFtZTogJ2RvYy1kZW1vJ1xufSlcbmNsYXNzIEN0cmwge1xuICAvLyBBdXRvYXNzaWduZWRcbiAgZWxlbWVudDogSFRNTFRlbXBsYXRlRWxlbWVudDtcbiAgaGludDogc3RyaW5nO1xuICBzY29wZTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGNvbnNvbGUuYXNzZXJ0KCF0aGlzLmhpbnQsIGAnZG9jLWRlbW8uJyBkb2Vzbid0IGV4cGVjdCBhbnkgaGludHMsIGdvdDogJHt0aGlzLmhpbnR9YCk7XG5cbiAgICAvLyBGb3JrIHRoZSBzY29wZS4gVXNlZnVsIGZvciBhdm9pZGluZyBgbGV0YCBjb25mbGljdHMgaW4gZGVtb3MuIE5vdFxuICAgIC8vIHJlY29tbWVuZGVkIGZvciBvdGhlciBzY2VuYXJpb3MuXG4gICAgbGV0IG1ldGEgPSBNZXRhLmdldE1ldGEodGhpcy5lbGVtZW50KTtcbiAgICBpZiAoIXRoaXMuc2NvcGUpIHRoaXMuc2NvcGUgPSBudWxsO1xuICAgIGlmICghbWV0YS5zY29wZSkge1xuICAgICAgbWV0YS5pbnNlcnRTY29wZSgpO1xuICAgICAgdGhpcy5zY29wZSA9IG1ldGEuc2NvcGU7XG4gICAgfVxuXG4gICAgLy8gQWRkIGEgZGVtbyB3cmFwcGVyLlxuICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuY2xhc3NMaXN0LmFkZCgnZG9jLWRlbW8nKTtcbiAgICBkaXYuaW5uZXJIVE1MID1cbiAgICAgIGA8cD5cbiAgICAgICAgPHNmLWljb24gc3ZnLWljb24uPVwiaW5mby1jaXJjbGVcIiBjbGFzcz1cImlubGluZSB0ZXh0LWluZm9cIj48L3NmLWljb24+XG4gICAgICAgIERlbW9cbiAgICAgIDwvcD5gO1xuXG4gICAgbGV0IGZyYWdtZW50ID0gdGhpcy5lbGVtZW50LmNvbnRlbnQ7XG4gICAgd2hpbGUgKGZyYWdtZW50Lmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgZGl2LmFwcGVuZENoaWxkKGZyYWdtZW50LnJlbW92ZUNoaWxkKGZyYWdtZW50LmZpcnN0Q2hpbGQpKTtcbiAgICB9XG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKGRpdik7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==