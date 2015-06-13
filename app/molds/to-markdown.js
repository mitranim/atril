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
                        attributeName: 'to-markdown'
                    })
                ], Ctrl);
                return Ctrl;
            })();
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vbGRzL3RvLW1hcmtkb3duLnRzIl0sIm5hbWVzIjpbIkN0cmwiLCJDdHJsLmNvbnN0cnVjdG9yIiwiQ3RybC5vblBoYXNlIiwiQ3RybC5yZXdyaXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBR0E7Z0JBV0VBO29CQUNFQyxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxRQUFRQSxDQUFDQSxhQUFhQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtvQkFDNUNBLElBQUlBLENBQUNBLE9BQU9BLEVBQUVBLENBQUNBO2dCQUNqQkEsQ0FBQ0E7Z0JBRURELHNCQUFPQSxHQUFQQTtvQkFDRUUsSUFBSUEsQ0FBQ0EsT0FBT0EsRUFBRUEsQ0FBQ0E7Z0JBQ2pCQSxDQUFDQTtnQkFFREYsc0JBQU9BLEdBQVBBO29CQUNFRyxJQUFJQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQTtvQkFDbkRBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLEtBQUtBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBO3dCQUFDQSxNQUFNQSxDQUFDQTtvQkFFckNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFNBQVNBLEdBQUdBLGdCQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtvQkFFdENBLEFBQ0FBLGlDQURpQ0E7d0JBQzdCQSxVQUFVQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxnQkFBZ0JBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBO29CQUMxREEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsRUFBRUEsR0FBR0EsVUFBVUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsR0FBR0EsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7d0JBQ3BEQSxJQUFJQSxJQUFJQSxHQUFHQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDekJBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLFlBQVlBLE9BQU9BLENBQUNBOzRCQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxHQUFHQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtvQkFDMURBLENBQUNBO29CQUVEQSxBQUNBQSwyQkFEMkJBOzJCQUNwQkEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsYUFBYUEsRUFBRUEsRUFBRUEsQ0FBQ0E7d0JBQ3BDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxXQUFXQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtvQkFDcERBLENBQUNBO29CQUVEQSxBQUNBQSxtQkFEbUJBOzJCQUNaQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxhQUFhQSxFQUFFQSxFQUFFQSxDQUFDQTt3QkFDbkNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFdBQVdBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBO29CQUM1RUEsQ0FBQ0E7b0JBRURBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLEtBQUtBLENBQUNBO2dCQUN6QkEsQ0FBQ0E7Z0JBeENESDtvQkFBQ0EsY0FBTUE7bUJBQUNBLHlCQUFPQSxFQUFzQkE7Z0JBQ3JDQTtvQkFBQ0EsY0FBTUE7bUJBQUNBLDRCQUFVQSxFQUFXQTtnQkFDN0JBO29CQUFDQSxjQUFNQTttQkFBQ0EsdUJBQUtBLEVBQU1BO2dCQU5yQkE7b0JBQUNBLFlBQUlBLENBQUNBO3dCQUNKQSxhQUFhQSxFQUFFQSxhQUFhQTtxQkFDN0JBLENBQUNBO3lCQTJDREE7Z0JBQURBLFdBQUNBO1lBQURBLENBN0NBLEFBNkNDQSxJQUFBIiwiZmlsZSI6Im1vbGRzL3RvLW1hcmtkb3duLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtNb2xkLCBhc3NpZ259IGZyb20gJ2F0cmlsJztcbmltcG9ydCBtYXJrZWQgZnJvbSAnbWFya2VkJztcblxuQE1vbGQoe1xuICBhdHRyaWJ1dGVOYW1lOiAndG8tbWFya2Rvd24nXG59KVxuY2xhc3MgQ3RybCB7XG4gIEBhc3NpZ24gZWxlbWVudDogSFRNTFRlbXBsYXRlRWxlbWVudDtcbiAgQGFzc2lnbiBleHByZXNzaW9uOiBGdW5jdGlvbjtcbiAgQGFzc2lnbiBzY29wZTogYW55O1xuXG4gIGJ1ZmZlcjogSFRNTEVsZW1lbnQ7XG4gIGxhc3RWYWx1ZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYnVmZmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5yZXdyaXRlKCk7XG4gIH1cblxuICBvblBoYXNlKCkge1xuICAgIHRoaXMucmV3cml0ZSgpO1xuICB9XG5cbiAgcmV3cml0ZSgpIHtcbiAgICBsZXQgdmFsdWUgPSB0aGlzLmV4cHJlc3Npb24odGhpcy5zY29wZSkgfHwgJycgKyAnJztcbiAgICBpZiAodmFsdWUgPT09IHRoaXMubGFzdFZhbHVlKSByZXR1cm47XG5cbiAgICB0aGlzLmJ1ZmZlci5pbm5lckhUTUwgPSBtYXJrZWQodmFsdWUpO1xuXG4gICAgLy8gRml4IGNvZGUgaGlnaGxpZ2h0aW5nIGNsYXNzZXMuXG4gICAgbGV0IGNvZGVCbG9ja3MgPSB0aGlzLmJ1ZmZlci5xdWVyeVNlbGVjdG9yQWxsKCdwcmUgY29kZScpO1xuICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGNvZGVCbG9ja3MubGVuZ3RoOyBpIDwgaWk7ICsraSkge1xuICAgICAgbGV0IG5vZGUgPSBjb2RlQmxvY2tzW2ldO1xuICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBFbGVtZW50KSBub2RlLmNsYXNzTGlzdC5hZGQoJ2hsanMnKTtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgZXhpc3RpbmcgY29udGVudC5cbiAgICB3aGlsZSAodGhpcy5lbGVtZW50Lmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICAvLyBBZGQgbmV3IGNvbnRlbnQuXG4gICAgd2hpbGUgKHRoaXMuYnVmZmVyLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuYnVmZmVyLnJlbW92ZUNoaWxkKHRoaXMuYnVmZmVyLmZpcnN0Q2hpbGQpKTtcbiAgICB9XG5cbiAgICB0aGlzLmxhc3RWYWx1ZSA9IHZhbHVlO1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=