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
                    // Neuter interpolations. This is necessary because a mold's output is re-
                    // compiled, so interpolations would be evaluated.
                    result = result.replace(/\{\{((?:[^}]|}(?=[^}]))*)\}\}/g, '{{<span>$1</span>}}');
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF0dHJpYnV0ZXMvbWFya2Rvd24udHMiXSwibmFtZXMiOlsiQ3RybCIsIkN0cmwuY29uc3RydWN0b3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFJQSxnQkFBTSxDQUFDLFVBQVUsQ0FBQztnQkFDaEIsR0FBRyxFQUFVLElBQUk7Z0JBQ2pCLE1BQU0sRUFBTyxJQUFJO2dCQUNqQixNQUFNLEVBQU8sS0FBSztnQkFDbEIsUUFBUSxFQUFLLEtBQUs7Z0JBQ2xCLFdBQVcsRUFBRSxLQUFLO2dCQUNsQixRQUFRLEVBQUssS0FBSztnQkFDbEIsU0FBUyxFQUFFLFVBQUMsSUFBSSxFQUFFLElBQUk7b0JBQ3BCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQzt3QkFBQyxNQUFNLENBQUMscUJBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQztvQkFDakQsTUFBTSxDQUFDLHFCQUFHLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQztnQkFDdkMsQ0FBQzthQUNGLENBQUMsQ0FBQztZQUVIO2dCQU1FQTtvQkFDRUMsSUFBSUEsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0E7b0JBRW5DQSxBQUNBQSxzQ0FEc0NBO3dCQUNsQ0EsTUFBTUEsR0FBR0EsUUFBUUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7b0JBQzNDQSxPQUFPQSxPQUFPQSxDQUFDQSxhQUFhQSxFQUFFQSxFQUFFQSxDQUFDQTt3QkFDL0JBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBLE9BQU9BLENBQUNBLFVBQVVBLENBQUNBLENBQUNBO29CQUN6Q0EsQ0FBQ0E7b0JBRURBLEFBQ0FBLHdCQUR3QkE7d0JBQ3BCQSxNQUFNQSxHQUFHQSxnQkFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7b0JBRXRDQSxBQUVBQSwwRUFGMEVBO29CQUMxRUEsa0RBQWtEQTtvQkFDbERBLE1BQU1BLEdBQUdBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLGdDQUFnQ0EsRUFBRUEscUJBQXFCQSxDQUFDQSxDQUFDQTtvQkFFakZBLE1BQU1BLENBQUNBLFNBQVNBLEdBQUdBLE1BQU1BLENBQUNBO29CQUUxQkEsQUFDQUEsaUNBRGlDQTt3QkFDN0JBLFVBQVVBLEdBQUdBLE1BQU1BLENBQUNBLGdCQUFnQkEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7b0JBQ3JEQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxFQUFFQSxHQUFHQSxVQUFVQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQTt3QkFDcERBLElBQUlBLElBQUlBLEdBQUdBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUN6QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsWUFBWUEsT0FBT0EsQ0FBQ0E7NEJBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLEdBQUdBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO29CQUMxREEsQ0FBQ0E7b0JBRURBLE9BQU9BLE1BQU1BLENBQUNBLGFBQWFBLEVBQUVBLEVBQUVBLENBQUNBO3dCQUM5QkEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2xFQSxDQUFDQTtnQkFDSEEsQ0FBQ0E7Z0JBbENIRDtvQkFBQ0EsWUFBSUEsQ0FBQ0E7d0JBQ0pBLGFBQWFBLEVBQUVBLFVBQVVBO3FCQUMxQkEsQ0FBQ0E7eUJBaUNEQTtnQkFBREEsV0FBQ0E7WUFBREEsQ0FuQ0EsQUFtQ0NBLElBQUEiLCJmaWxlIjoiYXR0cmlidXRlcy9tYXJrZG93bi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TW9sZH0gZnJvbSAnYXRyaWwnO1xuaW1wb3J0IG1hcmtlZCBmcm9tICdtYXJrZWQnO1xuaW1wb3J0IGhqcyBmcm9tICdoaWdobGlnaHRqcyc7XG5cbm1hcmtlZC5zZXRPcHRpb25zKHtcbiAgZ2ZtOiAgICAgICAgIHRydWUsXG4gIHRhYmxlczogICAgICB0cnVlLFxuICBicmVha3M6ICAgICAgZmFsc2UsXG4gIHNhbml0aXplOiAgICBmYWxzZSxcbiAgc21hcnR5cGFudHM6IGZhbHNlLFxuICBwZWRhbnRpYzogICAgZmFsc2UsXG4gIGhpZ2hsaWdodDogKGNvZGUsIGxhbmcpID0+IHtcbiAgICBpZiAobGFuZykgcmV0dXJuIGhqcy5oaWdobGlnaHQobGFuZywgY29kZSkudmFsdWU7XG4gICAgcmV0dXJuIGhqcy5oaWdobGlnaHRBdXRvKGNvZGUpLnZhbHVlO1xuICB9XG59KTtcblxuQE1vbGQoe1xuICBhdHRyaWJ1dGVOYW1lOiAnbWFya2Rvd24nXG59KVxuY2xhc3MgQ3RybCB7XG4gIGVsZW1lbnQ6IEhUTUxUZW1wbGF0ZUVsZW1lbnQ7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgbGV0IGNvbnRlbnQgPSB0aGlzLmVsZW1lbnQuY29udGVudDtcblxuICAgIC8vIENvbnZlcnQgZXhpc3RpbmcgY29udGVudCBpbnRvIHRleHQuXG4gICAgbGV0IGJ1ZmZlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHdoaWxlIChjb250ZW50Lmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgYnVmZmVyLmFwcGVuZENoaWxkKGNvbnRlbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuXG4gICAgLy8gUmVuZGVyIGludG8gbWFya2Rvd24uXG4gICAgbGV0IHJlc3VsdCA9IG1hcmtlZChidWZmZXIuaW5uZXJIVE1MKTtcblxuICAgIC8vIE5ldXRlciBpbnRlcnBvbGF0aW9ucy4gVGhpcyBpcyBuZWNlc3NhcnkgYmVjYXVzZSBhIG1vbGQncyBvdXRwdXQgaXMgcmUtXG4gICAgLy8gY29tcGlsZWQsIHNvIGludGVycG9sYXRpb25zIHdvdWxkIGJlIGV2YWx1YXRlZC5cbiAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZSgvXFx7XFx7KCg/OltefV18fSg/PVtefV0pKSopXFx9XFx9L2csICd7ezxzcGFuPiQxPC9zcGFuPn19Jyk7XG5cbiAgICBidWZmZXIuaW5uZXJIVE1MID0gcmVzdWx0O1xuXG4gICAgLy8gRml4IGNvZGUgaGlnaGxpZ2h0aW5nIGNsYXNzZXMuXG4gICAgbGV0IGNvZGVCbG9ja3MgPSBidWZmZXIucXVlcnlTZWxlY3RvckFsbCgncHJlIGNvZGUnKTtcbiAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBjb2RlQmxvY2tzLmxlbmd0aDsgaSA8IGlpOyArK2kpIHtcbiAgICAgIGxldCBub2RlID0gY29kZUJsb2Nrc1tpXTtcbiAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRWxlbWVudCkgbm9kZS5jbGFzc0xpc3QuYWRkKCdobGpzJyk7XG4gICAgfVxuXG4gICAgd2hpbGUgKGJ1ZmZlci5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChidWZmZXIucmVtb3ZlQ2hpbGQoYnVmZmVyLmZpcnN0Q2hpbGQpKTtcbiAgICB9XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==