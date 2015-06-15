var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};System.register(['atril', 'marked'], function(exports_1) {
    var atril_1, marked_1;
    var Ctrl;
    return {
        setters:[
            function (_atril_1) {
                atril_1 = _atril_1;
            },
            function (_marked_1) {
                marked_1 = _marked_1;
            }],
        execute: function() {
            Ctrl = (function () {
                function Ctrl() {
                    this.buffer = document.createElement('div');
                    this.rewrite();
                }
                Ctrl.prototype.onPhase = function () {
                    this.rewrite();
                };
                Ctrl.prototype.rewrite = function () {
                    var value = this.expression(this.scope) || '' + '';
                    if (value === this.lastValue)
                        return;
                    this.buffer.innerHTML = marked_1.default(value);
                    // Fix code highlighting classes.
                    var codeBlocks = this.buffer.querySelectorAll('pre code');
                    for (var i = 0, ii = codeBlocks.length; i < ii; ++i) {
                        var node = codeBlocks[i];
                        if (node instanceof Element)
                            node.classList.add('hljs');
                    }
                    // Remove existing content.
                    while (this.element.hasChildNodes()) {
                        this.element.removeChild(this.element.firstChild);
                    }
                    // Add new content.
                    while (this.buffer.hasChildNodes()) {
                        this.element.appendChild(this.buffer.removeChild(this.buffer.firstChild));
                    }
                    this.lastValue = value;
                };
                __decorate([
                    atril_1.assign
                ], Ctrl.prototype, "element");
                __decorate([
                    atril_1.assign
                ], Ctrl.prototype, "expression");
                __decorate([
                    atril_1.assign
                ], Ctrl.prototype, "scope");
                Ctrl = __decorate([
                    atril_1.Mold({
                        attributeName: 'markdown-live'
                    })
                ], Ctrl);
                return Ctrl;
            })();
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vbGRzL21hcmtkb3duLWxpdmUudHMiXSwibmFtZXMiOlsiQ3RybCIsIkN0cmwuY29uc3RydWN0b3IiLCJDdHJsLm9uUGhhc2UiLCJDdHJsLnJld3JpdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFHQTtnQkFXRUE7b0JBQ0VDLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLFFBQVFBLENBQUNBLGFBQWFBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO29CQUM1Q0EsSUFBSUEsQ0FBQ0EsT0FBT0EsRUFBRUEsQ0FBQ0E7Z0JBQ2pCQSxDQUFDQTtnQkFFREQsc0JBQU9BLEdBQVBBO29CQUNFRSxJQUFJQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQTtnQkFDakJBLENBQUNBO2dCQUVERixzQkFBT0EsR0FBUEE7b0JBQ0VHLElBQUlBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBO29CQUNuREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsS0FBS0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0E7d0JBQUNBLE1BQU1BLENBQUNBO29CQUVyQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsU0FBU0EsR0FBR0EsZ0JBQU1BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO29CQUV0Q0EsQUFDQUEsaUNBRGlDQTt3QkFDN0JBLFVBQVVBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLGdCQUFnQkEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7b0JBQzFEQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxFQUFFQSxHQUFHQSxVQUFVQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQTt3QkFDcERBLElBQUlBLElBQUlBLEdBQUdBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUN6QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsWUFBWUEsT0FBT0EsQ0FBQ0E7NEJBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLEdBQUdBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO29CQUMxREEsQ0FBQ0E7b0JBRURBLEFBQ0FBLDJCQUQyQkE7MkJBQ3BCQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxhQUFhQSxFQUFFQSxFQUFFQSxDQUFDQTt3QkFDcENBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFdBQVdBLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFVBQVVBLENBQUNBLENBQUNBO29CQUNwREEsQ0FBQ0E7b0JBRURBLEFBQ0FBLG1CQURtQkE7MkJBQ1pBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLGFBQWFBLEVBQUVBLEVBQUVBLENBQUNBO3dCQUNuQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzVFQSxDQUFDQTtvQkFFREEsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsS0FBS0EsQ0FBQ0E7Z0JBQ3pCQSxDQUFDQTtnQkF4Q0RIO29CQUFDQSxjQUFNQTttQkFBQ0EseUJBQU9BLEVBQXNCQTtnQkFDckNBO29CQUFDQSxjQUFNQTttQkFBQ0EsNEJBQVVBLEVBQVdBO2dCQUM3QkE7b0JBQUNBLGNBQU1BO21CQUFDQSx1QkFBS0EsRUFBTUE7Z0JBTnJCQTtvQkFBQ0EsWUFBSUEsQ0FBQ0E7d0JBQ0pBLGFBQWFBLEVBQUVBLGVBQWVBO3FCQUMvQkEsQ0FBQ0E7eUJBMkNEQTtnQkFBREEsV0FBQ0E7WUFBREEsQ0E3Q0EsQUE2Q0NBLElBQUEiLCJmaWxlIjoibW9sZHMvbWFya2Rvd24tbGl2ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TW9sZCwgYXNzaWdufSBmcm9tICdhdHJpbCc7XG5pbXBvcnQgbWFya2VkIGZyb20gJ21hcmtlZCc7XG5cbkBNb2xkKHtcbiAgYXR0cmlidXRlTmFtZTogJ21hcmtkb3duLWxpdmUnXG59KVxuY2xhc3MgQ3RybCB7XG4gIEBhc3NpZ24gZWxlbWVudDogSFRNTFRlbXBsYXRlRWxlbWVudDtcbiAgQGFzc2lnbiBleHByZXNzaW9uOiBGdW5jdGlvbjtcbiAgQGFzc2lnbiBzY29wZTogYW55O1xuXG4gIGJ1ZmZlcjogSFRNTEVsZW1lbnQ7XG4gIGxhc3RWYWx1ZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYnVmZmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5yZXdyaXRlKCk7XG4gIH1cblxuICBvblBoYXNlKCkge1xuICAgIHRoaXMucmV3cml0ZSgpO1xuICB9XG5cbiAgcmV3cml0ZSgpIHtcbiAgICBsZXQgdmFsdWUgPSB0aGlzLmV4cHJlc3Npb24odGhpcy5zY29wZSkgfHwgJycgKyAnJztcbiAgICBpZiAodmFsdWUgPT09IHRoaXMubGFzdFZhbHVlKSByZXR1cm47XG5cbiAgICB0aGlzLmJ1ZmZlci5pbm5lckhUTUwgPSBtYXJrZWQodmFsdWUpO1xuXG4gICAgLy8gRml4IGNvZGUgaGlnaGxpZ2h0aW5nIGNsYXNzZXMuXG4gICAgbGV0IGNvZGVCbG9ja3MgPSB0aGlzLmJ1ZmZlci5xdWVyeVNlbGVjdG9yQWxsKCdwcmUgY29kZScpO1xuICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGNvZGVCbG9ja3MubGVuZ3RoOyBpIDwgaWk7ICsraSkge1xuICAgICAgbGV0IG5vZGUgPSBjb2RlQmxvY2tzW2ldO1xuICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFbGVtZW50KSBub2RlLmNsYXNzTGlzdC5hZGQoJ2hsanMnKTtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgZXhpc3RpbmcgY29udGVudC5cbiAgICB3aGlsZSAodGhpcy5lbGVtZW50Lmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICAvLyBBZGQgbmV3IGNvbnRlbnQuXG4gICAgd2hpbGUgKHRoaXMuYnVmZmVyLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuYnVmZmVyLnJlbW92ZUNoaWxkKHRoaXMuYnVmZmVyLmZpcnN0Q2hpbGQpKTtcbiAgICB9XG5cbiAgICB0aGlzLmxhc3RWYWx1ZSA9IHZhbHVlO1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=