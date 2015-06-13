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
                    var content = this.element.content;
                    // Convert existing content into text.
                    var buffer = document.createElement('div');
                    while (content.hasChildNodes()) {
                        buffer.appendChild(content.firstChild);
                    }
                    // Render into markdown.
                    var result = marked_1.default(buffer.innerHTML);
                    buffer.innerHTML = result;
                    // Fix code highlighting classes.
                    var codeBlocks = buffer.querySelectorAll('pre code');
                    for (var i = 0, ii = codeBlocks.length; i < ii; ++i) {
                        var node = codeBlocks[i];
                        if (node instanceof Element)
                            node.classList.add('hljs');
                    }
                    while (buffer.hasChildNodes()) {
                        this.element.appendChild(buffer.removeChild(buffer.firstChild));
                    }
                }
                __decorate([
                    atril_1.assign
                ], Ctrl.prototype, "element");
                Ctrl = __decorate([
                    atril_1.Mold({
                        attributeName: 'markdown'
                    })
                ], Ctrl);
                return Ctrl;
            })();
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vbGRzL21hcmtkb3duLnRzIl0sIm5hbWVzIjpbIkN0cmwiLCJDdHJsLmNvbnN0cnVjdG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBR0E7Z0JBTUVBO29CQUNFQyxJQUFJQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQTtvQkFFbkNBLEFBQ0FBLHNDQURzQ0E7d0JBQ2xDQSxNQUFNQSxHQUFHQSxRQUFRQSxDQUFDQSxhQUFhQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtvQkFDM0NBLE9BQU9BLE9BQU9BLENBQUNBLGFBQWFBLEVBQUVBLEVBQUVBLENBQUNBO3dCQUMvQkEsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7b0JBQ3pDQSxDQUFDQTtvQkFFREEsQUFDQUEsd0JBRHdCQTt3QkFDcEJBLE1BQU1BLEdBQUdBLGdCQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQTtvQkFDdENBLE1BQU1BLENBQUNBLFNBQVNBLEdBQUdBLE1BQU1BLENBQUNBO29CQUUxQkEsQUFDQUEsaUNBRGlDQTt3QkFDN0JBLFVBQVVBLEdBQUdBLE1BQU1BLENBQUNBLGdCQUFnQkEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7b0JBQ3JEQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxFQUFFQSxHQUFHQSxVQUFVQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQTt3QkFDcERBLElBQUlBLElBQUlBLEdBQUdBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUN6QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsWUFBWUEsT0FBT0EsQ0FBQ0E7NEJBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLEdBQUdBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO29CQUMxREEsQ0FBQ0E7b0JBRURBLE9BQU9BLE1BQU1BLENBQUNBLGFBQWFBLEVBQUVBLEVBQUVBLENBQUNBO3dCQUM5QkEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2xFQSxDQUFDQTtnQkFDSEEsQ0FBQ0E7Z0JBekJERDtvQkFBQ0EsY0FBTUE7bUJBQUNBLHlCQUFPQSxFQUFzQkE7Z0JBSnZDQTtvQkFBQ0EsWUFBSUEsQ0FBQ0E7d0JBQ0pBLGFBQWFBLEVBQUVBLFVBQVVBO3FCQUMxQkEsQ0FBQ0E7eUJBNEJEQTtnQkFBREEsV0FBQ0E7WUFBREEsQ0E5QkEsQUE4QkNBLElBQUEiLCJmaWxlIjoibW9sZHMvbWFya2Rvd24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge01vbGQsIGFzc2lnbn0gZnJvbSAnYXRyaWwnO1xuaW1wb3J0IG1hcmtlZCBmcm9tICdtYXJrZWQnO1xuXG5ATW9sZCh7XG4gIGF0dHJpYnV0ZU5hbWU6ICdtYXJrZG93bidcbn0pXG5jbGFzcyBDdHJsIHtcbiAgQGFzc2lnbiBlbGVtZW50OiBIVE1MVGVtcGxhdGVFbGVtZW50O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGxldCBjb250ZW50ID0gdGhpcy5lbGVtZW50LmNvbnRlbnQ7XG5cbiAgICAvLyBDb252ZXJ0IGV4aXN0aW5nIGNvbnRlbnQgaW50byB0ZXh0LlxuICAgIGxldCBidWZmZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB3aGlsZSAoY29udGVudC5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgIGJ1ZmZlci5hcHBlbmRDaGlsZChjb250ZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cblxuICAgIC8vIFJlbmRlciBpbnRvIG1hcmtkb3duLlxuICAgIGxldCByZXN1bHQgPSBtYXJrZWQoYnVmZmVyLmlubmVySFRNTCk7XG4gICAgYnVmZmVyLmlubmVySFRNTCA9IHJlc3VsdDtcblxuICAgIC8vIEZpeCBjb2RlIGhpZ2hsaWdodGluZyBjbGFzc2VzLlxuICAgIGxldCBjb2RlQmxvY2tzID0gYnVmZmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ3ByZSBjb2RlJyk7XG4gICAgZm9yIChsZXQgaSA9IDAsIGlpID0gY29kZUJsb2Nrcy5sZW5ndGg7IGkgPCBpaTsgKytpKSB7XG4gICAgICBsZXQgbm9kZSA9IGNvZGVCbG9ja3NbaV07XG4gICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEVsZW1lbnQpIG5vZGUuY2xhc3NMaXN0LmFkZCgnaGxqcycpO1xuICAgIH1cblxuICAgIHdoaWxlIChidWZmZXIuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoYnVmZmVyLnJlbW92ZUNoaWxkKGJ1ZmZlci5maXJzdENoaWxkKSk7XG4gICAgfVxuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=