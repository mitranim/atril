var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};System.register(['atril', 'marked', 'highlightjs'], function(exports_1) {
    var atril_1, marked_1, highlightjs_1;
    var Ctrl;
    return {
        setters:[
            function (_atril_1) {
                atril_1 = _atril_1;
            },
            function (_marked_1) {
                marked_1 = _marked_1;
            },
            function (_highlightjs_1) {
                highlightjs_1 = _highlightjs_1;
            }],
        execute: function() {
            marked_1.default.setOptions({
                gfm: true,
                tables: true,
                breaks: false,
                sanitize: false,
                smartypants: false,
                pedantic: false,
                highlight: function (code, lang) {
                    if (lang)
                        return highlightjs_1.default.highlight(lang, code).value;
                    return highlightjs_1.default.highlightAuto(code).value;
                }
            });
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vbGRzL21hcmtkb3duLnRzIl0sIm5hbWVzIjpbIkN0cmwiLCJDdHJsLmNvbnN0cnVjdG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBSUEsZ0JBQU0sQ0FBQyxVQUFVLENBQUM7Z0JBQ2hCLEdBQUcsRUFBVSxJQUFJO2dCQUNqQixNQUFNLEVBQU8sSUFBSTtnQkFDakIsTUFBTSxFQUFPLEtBQUs7Z0JBQ2xCLFFBQVEsRUFBSyxLQUFLO2dCQUNsQixXQUFXLEVBQUUsS0FBSztnQkFDbEIsUUFBUSxFQUFLLEtBQUs7Z0JBQ2xCLFNBQVMsRUFBRSxVQUFDLElBQUksRUFBRSxJQUFJO29CQUNwQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUM7d0JBQUMsTUFBTSxDQUFDLHFCQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUM7b0JBQ2pELE1BQU0sQ0FBQyxxQkFBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0JBQ3ZDLENBQUM7YUFDRixDQUFDLENBQUM7WUFFSDtnQkFNRUE7b0JBQ0VDLElBQUlBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBO29CQUVuQ0EsQUFDQUEsc0NBRHNDQTt3QkFDbENBLE1BQU1BLEdBQUdBLFFBQVFBLENBQUNBLGFBQWFBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO29CQUMzQ0EsT0FBT0EsT0FBT0EsQ0FBQ0EsYUFBYUEsRUFBRUEsRUFBRUEsQ0FBQ0E7d0JBQy9CQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQSxPQUFPQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtvQkFDekNBLENBQUNBO29CQUVEQSxBQUNBQSx3QkFEd0JBO3dCQUNwQkEsTUFBTUEsR0FBR0EsZ0JBQU1BLENBQUNBLE1BQU1BLENBQUNBLFNBQVNBLENBQUNBLENBQUNBO29CQUN0Q0EsTUFBTUEsQ0FBQ0EsU0FBU0EsR0FBR0EsTUFBTUEsQ0FBQ0E7b0JBRTFCQSxBQUNBQSxpQ0FEaUNBO3dCQUM3QkEsVUFBVUEsR0FBR0EsTUFBTUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtvQkFDckRBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLEVBQUVBLEdBQUdBLFVBQVVBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEdBQUdBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBO3dCQUNwREEsSUFBSUEsSUFBSUEsR0FBR0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3pCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxZQUFZQSxPQUFPQSxDQUFDQTs0QkFBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7b0JBQzFEQSxDQUFDQTtvQkFFREEsT0FBT0EsTUFBTUEsQ0FBQ0EsYUFBYUEsRUFBRUEsRUFBRUEsQ0FBQ0E7d0JBQzlCQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxXQUFXQSxDQUFDQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDbEVBLENBQUNBO2dCQUNIQSxDQUFDQTtnQkE3QkhEO29CQUFDQSxZQUFJQSxDQUFDQTt3QkFDSkEsYUFBYUEsRUFBRUEsVUFBVUE7cUJBQzFCQSxDQUFDQTt5QkE0QkRBO2dCQUFEQSxXQUFDQTtZQUFEQSxDQTlCQSxBQThCQ0EsSUFBQSIsImZpbGUiOiJtb2xkcy9tYXJrZG93bi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TW9sZH0gZnJvbSAnYXRyaWwnO1xuaW1wb3J0IG1hcmtlZCBmcm9tICdtYXJrZWQnO1xuaW1wb3J0IGhqcyBmcm9tICdoaWdobGlnaHRqcyc7XG5cbm1hcmtlZC5zZXRPcHRpb25zKHtcbiAgZ2ZtOiAgICAgICAgIHRydWUsXG4gIHRhYmxlczogICAgICB0cnVlLFxuICBicmVha3M6ICAgICAgZmFsc2UsXG4gIHNhbml0aXplOiAgICBmYWxzZSxcbiAgc21hcnR5cGFudHM6IGZhbHNlLFxuICBwZWRhbnRpYzogICAgZmFsc2UsXG4gIGhpZ2hsaWdodDogKGNvZGUsIGxhbmcpID0+IHtcbiAgICBpZiAobGFuZykgcmV0dXJuIGhqcy5oaWdobGlnaHQobGFuZywgY29kZSkudmFsdWU7XG4gICAgcmV0dXJuIGhqcy5oaWdobGlnaHRBdXRvKGNvZGUpLnZhbHVlO1xuICB9XG59KTtcblxuQE1vbGQoe1xuICBhdHRyaWJ1dGVOYW1lOiAnbWFya2Rvd24nXG59KVxuY2xhc3MgQ3RybCB7XG4gIGVsZW1lbnQ6IEhUTUxUZW1wbGF0ZUVsZW1lbnQ7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgbGV0IGNvbnRlbnQgPSB0aGlzLmVsZW1lbnQuY29udGVudDtcblxuICAgIC8vIENvbnZlcnQgZXhpc3RpbmcgY29udGVudCBpbnRvIHRleHQuXG4gICAgbGV0IGJ1ZmZlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHdoaWxlIChjb250ZW50Lmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgYnVmZmVyLmFwcGVuZENoaWxkKGNvbnRlbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuXG4gICAgLy8gUmVuZGVyIGludG8gbWFya2Rvd24uXG4gICAgbGV0IHJlc3VsdCA9IG1hcmtlZChidWZmZXIuaW5uZXJIVE1MKTtcbiAgICBidWZmZXIuaW5uZXJIVE1MID0gcmVzdWx0O1xuXG4gICAgLy8gRml4IGNvZGUgaGlnaGxpZ2h0aW5nIGNsYXNzZXMuXG4gICAgbGV0IGNvZGVCbG9ja3MgPSBidWZmZXIucXVlcnlTZWxlY3RvckFsbCgncHJlIGNvZGUnKTtcbiAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBjb2RlQmxvY2tzLmxlbmd0aDsgaSA8IGlpOyArK2kpIHtcbiAgICAgIGxldCBub2RlID0gY29kZUJsb2Nrc1tpXTtcbiAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRWxlbWVudCkgbm9kZS5jbGFzc0xpc3QuYWRkKCdobGpzJyk7XG4gICAgfVxuXG4gICAgd2hpbGUgKGJ1ZmZlci5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChidWZmZXIucmVtb3ZlQ2hpbGQoYnVmZmVyLmZpcnN0Q2hpbGQpKTtcbiAgICB9XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==