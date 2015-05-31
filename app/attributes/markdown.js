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
                    // Neuter interpolations. This is necessary because a draft's output is re-
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
                    atril_1.Draft({
                        attributeName: 'markdown'
                    })
                ], Ctrl);
                return Ctrl;
            })();
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF0dHJpYnV0ZXMvbWFya2Rvd24udHMiXSwibmFtZXMiOlsiQ3RybCIsIkN0cmwuY29uc3RydWN0b3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFJQSxnQkFBTSxDQUFDLFVBQVUsQ0FBQztnQkFDaEIsR0FBRyxFQUFVLElBQUk7Z0JBQ2pCLE1BQU0sRUFBTyxJQUFJO2dCQUNqQixNQUFNLEVBQU8sS0FBSztnQkFDbEIsUUFBUSxFQUFLLEtBQUs7Z0JBQ2xCLFdBQVcsRUFBRSxLQUFLO2dCQUNsQixRQUFRLEVBQUssS0FBSztnQkFDbEIsU0FBUyxFQUFFLFVBQUMsSUFBSSxFQUFFLElBQUk7b0JBQ3BCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQzt3QkFBQyxNQUFNLENBQUMscUJBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQztvQkFDakQsTUFBTSxDQUFDLHFCQUFHLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQztnQkFDdkMsQ0FBQzthQUNGLENBQUMsQ0FBQztZQUVIO2dCQU1FQTtvQkFDRUMsSUFBSUEsT0FBT0EsR0FBMkJBLElBQUlBLENBQUNBLE9BQVFBLENBQUNBLE9BQU9BLENBQUNBO29CQUU1REEsQUFDQUEsc0NBRHNDQTt3QkFDbENBLE1BQU1BLEdBQUdBLFFBQVFBLENBQUNBLGFBQWFBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO29CQUMzQ0EsT0FBT0EsT0FBT0EsQ0FBQ0EsYUFBYUEsRUFBRUEsRUFBRUEsQ0FBQ0E7d0JBQy9CQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQSxPQUFPQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtvQkFDekNBLENBQUNBO29CQUVEQSxBQUNBQSx3QkFEd0JBO3dCQUNwQkEsTUFBTUEsR0FBR0EsZ0JBQU1BLENBQUNBLE1BQU1BLENBQUNBLFNBQVNBLENBQUNBLENBQUNBO29CQUV0Q0EsQUFFQUEsMkVBRjJFQTtvQkFDM0VBLGtEQUFrREE7b0JBQ2xEQSxNQUFNQSxHQUFHQSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSxnQ0FBZ0NBLEVBQUVBLHFCQUFxQkEsQ0FBQ0EsQ0FBQ0E7b0JBRWpGQSxNQUFNQSxDQUFDQSxTQUFTQSxHQUFHQSxNQUFNQSxDQUFDQTtvQkFFMUJBLEFBQ0FBLGlDQURpQ0E7d0JBQzdCQSxVQUFVQSxHQUFHQSxNQUFNQSxDQUFDQSxnQkFBZ0JBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBO29CQUNyREEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsRUFBRUEsR0FBR0EsVUFBVUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsR0FBR0EsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7d0JBQ3BEQSxJQUFJQSxJQUFJQSxHQUFHQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDekJBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLFlBQVlBLE9BQU9BLENBQUNBOzRCQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxHQUFHQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtvQkFDMURBLENBQUNBO29CQUVEQSxPQUFPQSxNQUFNQSxDQUFDQSxhQUFhQSxFQUFFQSxFQUFFQSxDQUFDQTt3QkFDOUJBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFdBQVdBLENBQUNBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBLE1BQU1BLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBO29CQUNsRUEsQ0FBQ0E7Z0JBQ0hBLENBQUNBO2dCQWxDSEQ7b0JBQUNBLGFBQUtBLENBQUNBO3dCQUNMQSxhQUFhQSxFQUFFQSxVQUFVQTtxQkFDMUJBLENBQUNBO3lCQWlDREE7Z0JBQURBLFdBQUNBO1lBQURBLENBbkNBLEFBbUNDQSxJQUFBIiwiZmlsZSI6ImF0dHJpYnV0ZXMvbWFya2Rvd24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0RyYWZ0fSBmcm9tICdhdHJpbCc7XG5pbXBvcnQgbWFya2VkIGZyb20gJ21hcmtlZCc7XG5pbXBvcnQgaGpzIGZyb20gJ2hpZ2hsaWdodGpzJztcblxubWFya2VkLnNldE9wdGlvbnMoe1xuICBnZm06ICAgICAgICAgdHJ1ZSxcbiAgdGFibGVzOiAgICAgIHRydWUsXG4gIGJyZWFrczogICAgICBmYWxzZSxcbiAgc2FuaXRpemU6ICAgIGZhbHNlLFxuICBzbWFydHlwYW50czogZmFsc2UsXG4gIHBlZGFudGljOiAgICBmYWxzZSxcbiAgaGlnaGxpZ2h0OiAoY29kZSwgbGFuZykgPT4ge1xuICAgIGlmIChsYW5nKSByZXR1cm4gaGpzLmhpZ2hsaWdodChsYW5nLCBjb2RlKS52YWx1ZTtcbiAgICByZXR1cm4gaGpzLmhpZ2hsaWdodEF1dG8oY29kZSkudmFsdWU7XG4gIH1cbn0pO1xuXG5ARHJhZnQoe1xuICBhdHRyaWJ1dGVOYW1lOiAnbWFya2Rvd24nXG59KVxuY2xhc3MgQ3RybCB7XG4gIGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGxldCBjb250ZW50ID0gPERvY3VtZW50RnJhZ21lbnQ+KDxhbnk+dGhpcy5lbGVtZW50KS5jb250ZW50O1xuXG4gICAgLy8gQ29udmVydCBleGlzdGluZyBjb250ZW50IGludG8gdGV4dC5cbiAgICBsZXQgYnVmZmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgd2hpbGUgKGNvbnRlbnQuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICBidWZmZXIuYXBwZW5kQ2hpbGQoY29udGVudC5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICAvLyBSZW5kZXIgaW50byBtYXJrZG93bi5cbiAgICBsZXQgcmVzdWx0ID0gbWFya2VkKGJ1ZmZlci5pbm5lckhUTUwpO1xuXG4gICAgLy8gTmV1dGVyIGludGVycG9sYXRpb25zLiBUaGlzIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIGEgZHJhZnQncyBvdXRwdXQgaXMgcmUtXG4gICAgLy8gY29tcGlsZWQsIHNvIGludGVycG9sYXRpb25zIHdvdWxkIGJlIGV2YWx1YXRlZC5cbiAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZSgvXFx7XFx7KCg/OltefV18fSg/PVtefV0pKSopXFx9XFx9L2csICd7ezxzcGFuPiQxPC9zcGFuPn19Jyk7XG5cbiAgICBidWZmZXIuaW5uZXJIVE1MID0gcmVzdWx0O1xuXG4gICAgLy8gRml4IGNvZGUgaGlnaGxpZ2h0aW5nIGNsYXNzZXMuXG4gICAgbGV0IGNvZGVCbG9ja3MgPSBidWZmZXIucXVlcnlTZWxlY3RvckFsbCgncHJlIGNvZGUnKTtcbiAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBjb2RlQmxvY2tzLmxlbmd0aDsgaSA8IGlpOyArK2kpIHtcbiAgICAgIGxldCBub2RlID0gY29kZUJsb2Nrc1tpXTtcbiAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRWxlbWVudCkgbm9kZS5jbGFzc0xpc3QuYWRkKCdobGpzJyk7XG4gICAgfVxuXG4gICAgd2hpbGUgKGJ1ZmZlci5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChidWZmZXIucmVtb3ZlQ2hpbGQoYnVmZmVyLmZpcnN0Q2hpbGQpKTtcbiAgICB9XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==