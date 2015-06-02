var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};System.register(['atril', 'highlightjs'], function(exports_1) {
    var atril_1, highlightjs_1;
    var Ctrl;
    return {
        setters:[
            function (_atril_1) {
                atril_1 = _atril_1;
            },
            function (_highlightjs_1) {
                highlightjs_1 = _highlightjs_1;
            }],
        execute: function() {
            Ctrl = (function () {
                function Ctrl() {
                    var content = this.element.content;
                    console.assert(content.firstChild instanceof HTMLPreElement, "'highlight.*' expects to be used on a <pre> tag, got:", content.firstChild);
                    var pre = content.firstChild;
                    // Convert existing content into text.
                    var result = this.hint ? highlightjs_1.default.highlight(this.hint, pre.innerHTML) : highlightjs_1.default.highlightAuto(pre.innerHTML);
                    // Neuter interpolations. This is necessary because a mold's output is re-
                    // compiled, so interpolations would be evaluated.
                    result.value = result.value.replace(/\{\{((?:[^}]|}(?=[^}]))*)\}\}/g, '{{<span>$1</span>}}');
                    // Transfer normal attributes.
                    for (var i = 0, ii = this.element.attributes.length; i < ii; ++i) {
                        var attr = this.element.attributes[i];
                        if (!this.looksLikeCustomAttribute(attr.name)) {
                            pre.setAttribute(attr.name, attr.value);
                        }
                    }
                    // Render highlighted code.
                    pre.innerHTML = "<code class=\"hljs lang-" + result.language + "\">" + result.value + "</code>";
                    this.element.appendChild(pre);
                }
                Ctrl.prototype.looksLikeCustomAttribute = function (attributeName) {
                    return /^[a-z-]+\./.test(attributeName);
                };
                Ctrl = __decorate([
                    atril_1.Mold({
                        attributeName: 'highlight'
                    })
                ], Ctrl);
                return Ctrl;
            })();
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF0dHJpYnV0ZXMvaGlnaGxpZ2h0LnRzIl0sIm5hbWVzIjpbIkN0cmwiLCJDdHJsLmNvbnN0cnVjdG9yIiwiQ3RybC5sb29rc0xpa2VDdXN0b21BdHRyaWJ1dGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFHQTtnQkFRRUE7b0JBQ0VDLElBQUlBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBO29CQUVuQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsVUFBVUEsWUFBWUEsY0FBY0EsRUFDNUNBLHVEQUF1REEsRUFBRUEsT0FBT0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7b0JBRTVGQSxJQUFJQSxHQUFHQSxHQUFtQkEsT0FBT0EsQ0FBQ0EsVUFBVUEsQ0FBQ0E7b0JBRTdDQSxBQUNBQSxzQ0FEc0NBO3dCQUNsQ0EsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EscUJBQUdBLENBQUNBLFNBQVNBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLEVBQUVBLEdBQUdBLENBQUNBLFNBQVNBLENBQUNBLEdBQUVBLHFCQUFHQSxDQUFDQSxhQUFhQSxDQUFDQSxHQUFHQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQTtvQkFFbkdBLEFBRUFBLDBFQUYwRUE7b0JBQzFFQSxrREFBa0RBO29CQUNsREEsTUFBTUEsQ0FBQ0EsS0FBS0EsR0FBR0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsZ0NBQWdDQSxFQUFFQSxxQkFBcUJBLENBQUNBLENBQUNBO29CQUU3RkEsQUFDQUEsOEJBRDhCQTtvQkFDOUJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFVBQVVBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEdBQUdBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBO3dCQUNqRUEsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3RDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSx3QkFBd0JBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBOzRCQUM5Q0EsR0FBR0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsRUFBRUEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7d0JBQzFDQSxDQUFDQTtvQkFDSEEsQ0FBQ0E7b0JBRURBLEFBQ0FBLDJCQUQyQkE7b0JBQzNCQSxHQUFHQSxDQUFDQSxTQUFTQSxHQUFHQSw2QkFBMEJBLE1BQU1BLENBQUNBLFFBQVFBLFdBQUtBLE1BQU1BLENBQUNBLEtBQUtBLFlBQVNBLENBQUNBO29CQUNwRkEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2hDQSxDQUFDQTtnQkFFREQsdUNBQXdCQSxHQUF4QkEsVUFBeUJBLGFBQXFCQTtvQkFDNUNFLE1BQU1BLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBO2dCQUMxQ0EsQ0FBQ0E7Z0JBdENIRjtvQkFBQ0EsWUFBSUEsQ0FBQ0E7d0JBQ0pBLGFBQWFBLEVBQUVBLFdBQVdBO3FCQUMzQkEsQ0FBQ0E7eUJBcUNEQTtnQkFBREEsV0FBQ0E7WUFBREEsQ0F2Q0EsQUF1Q0NBLElBQUEiLCJmaWxlIjoiYXR0cmlidXRlcy9oaWdobGlnaHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge01vbGR9IGZyb20gJ2F0cmlsJztcbmltcG9ydCBoanMgZnJvbSAnaGlnaGxpZ2h0anMnO1xuXG5ATW9sZCh7XG4gIGF0dHJpYnV0ZU5hbWU6ICdoaWdobGlnaHQnXG59KVxuY2xhc3MgQ3RybCB7XG4gIGVsZW1lbnQ6IEhUTUxUZW1wbGF0ZUVsZW1lbnQ7XG4gIC8vIExhbmd1YWdlLlxuICBoaW50OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgbGV0IGNvbnRlbnQgPSB0aGlzLmVsZW1lbnQuY29udGVudDtcblxuICAgIGNvbnNvbGUuYXNzZXJ0KGNvbnRlbnQuZmlyc3RDaGlsZCBpbnN0YW5jZW9mIEhUTUxQcmVFbGVtZW50LFxuICAgICAgICAgICAgICAgICAgIGAnaGlnaGxpZ2h0LionIGV4cGVjdHMgdG8gYmUgdXNlZCBvbiBhIDxwcmU+IHRhZywgZ290OmAsIGNvbnRlbnQuZmlyc3RDaGlsZCk7XG5cbiAgICBsZXQgcHJlID0gPEhUTUxQcmVFbGVtZW50PmNvbnRlbnQuZmlyc3RDaGlsZDtcblxuICAgIC8vIENvbnZlcnQgZXhpc3RpbmcgY29udGVudCBpbnRvIHRleHQuXG4gICAgbGV0IHJlc3VsdCA9IHRoaXMuaGludCA/IGhqcy5oaWdobGlnaHQodGhpcy5oaW50LCBwcmUuaW5uZXJIVE1MKTogaGpzLmhpZ2hsaWdodEF1dG8ocHJlLmlubmVySFRNTCk7XG5cbiAgICAvLyBOZXV0ZXIgaW50ZXJwb2xhdGlvbnMuIFRoaXMgaXMgbmVjZXNzYXJ5IGJlY2F1c2UgYSBtb2xkJ3Mgb3V0cHV0IGlzIHJlLVxuICAgIC8vIGNvbXBpbGVkLCBzbyBpbnRlcnBvbGF0aW9ucyB3b3VsZCBiZSBldmFsdWF0ZWQuXG4gICAgcmVzdWx0LnZhbHVlID0gcmVzdWx0LnZhbHVlLnJlcGxhY2UoL1xce1xceygoPzpbXn1dfH0oPz1bXn1dKSkqKVxcfVxcfS9nLCAne3s8c3Bhbj4kMTwvc3Bhbj59fScpO1xuXG4gICAgLy8gVHJhbnNmZXIgbm9ybWFsIGF0dHJpYnV0ZXMuXG4gICAgZm9yIChsZXQgaSA9IDAsIGlpID0gdGhpcy5lbGVtZW50LmF0dHJpYnV0ZXMubGVuZ3RoOyBpIDwgaWk7ICsraSkge1xuICAgICAgbGV0IGF0dHIgPSB0aGlzLmVsZW1lbnQuYXR0cmlidXRlc1tpXTtcbiAgICAgIGlmICghdGhpcy5sb29rc0xpa2VDdXN0b21BdHRyaWJ1dGUoYXR0ci5uYW1lKSkge1xuICAgICAgICBwcmUuc2V0QXR0cmlidXRlKGF0dHIubmFtZSwgYXR0ci52YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVuZGVyIGhpZ2hsaWdodGVkIGNvZGUuXG4gICAgcHJlLmlubmVySFRNTCA9IGA8Y29kZSBjbGFzcz1cImhsanMgbGFuZy0ke3Jlc3VsdC5sYW5ndWFnZX1cIj4ke3Jlc3VsdC52YWx1ZX08L2NvZGU+YDtcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQocHJlKTtcbiAgfVxuXG4gIGxvb2tzTGlrZUN1c3RvbUF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gL15bYS16LV0rXFwuLy50ZXN0KGF0dHJpYnV0ZU5hbWUpO1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=