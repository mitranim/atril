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
                    // Neuter interpolations. This is necessary because a draft's output is re-
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
                    atril_1.Draft({
                        attributeName: 'highlight'
                    })
                ], Ctrl);
                return Ctrl;
            })();
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF0dHJpYnV0ZXMvaGlnaGxpZ2h0LnRzIl0sIm5hbWVzIjpbIkN0cmwiLCJDdHJsLmNvbnN0cnVjdG9yIiwiQ3RybC5sb29rc0xpa2VDdXN0b21BdHRyaWJ1dGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFHQTtnQkFRRUE7b0JBQ0VDLElBQUlBLE9BQU9BLEdBQTJCQSxJQUFJQSxDQUFDQSxPQUFRQSxDQUFDQSxPQUFPQSxDQUFDQTtvQkFFNURBLE9BQU9BLENBQUNBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLFVBQVVBLFlBQVlBLGNBQWNBLEVBQzVDQSx1REFBdURBLEVBQUVBLE9BQU9BLENBQUNBLFVBQVVBLENBQUNBLENBQUNBO29CQUU1RkEsSUFBSUEsR0FBR0EsR0FBbUJBLE9BQU9BLENBQUNBLFVBQVVBLENBQUNBO29CQUU3Q0EsQUFDQUEsc0NBRHNDQTt3QkFDbENBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLHFCQUFHQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxHQUFHQSxDQUFDQSxTQUFTQSxDQUFDQSxHQUFFQSxxQkFBR0EsQ0FBQ0EsYUFBYUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7b0JBRW5HQSxBQUVBQSwyRUFGMkVBO29CQUMzRUEsa0RBQWtEQTtvQkFDbERBLE1BQU1BLENBQUNBLEtBQUtBLEdBQUdBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLE9BQU9BLENBQUNBLGdDQUFnQ0EsRUFBRUEscUJBQXFCQSxDQUFDQSxDQUFDQTtvQkFFN0ZBLEFBQ0FBLDhCQUQ4QkE7b0JBQzlCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQTt3QkFDakVBLElBQUlBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUN0Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0Esd0JBQXdCQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDOUNBLEdBQUdBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLEVBQUVBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO3dCQUMxQ0EsQ0FBQ0E7b0JBQ0hBLENBQUNBO29CQUVEQSxBQUNBQSwyQkFEMkJBO29CQUMzQkEsR0FBR0EsQ0FBQ0EsU0FBU0EsR0FBR0EsNkJBQTBCQSxNQUFNQSxDQUFDQSxRQUFRQSxXQUFLQSxNQUFNQSxDQUFDQSxLQUFLQSxZQUFTQSxDQUFDQTtvQkFDcEZBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFdBQVdBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO2dCQUNoQ0EsQ0FBQ0E7Z0JBRURELHVDQUF3QkEsR0FBeEJBLFVBQXlCQSxhQUFxQkE7b0JBQzVDRSxNQUFNQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxDQUFDQTtnQkFDMUNBLENBQUNBO2dCQXRDSEY7b0JBQUNBLGFBQUtBLENBQUNBO3dCQUNMQSxhQUFhQSxFQUFFQSxXQUFXQTtxQkFDM0JBLENBQUNBO3lCQXFDREE7Z0JBQURBLFdBQUNBO1lBQURBLENBdkNBLEFBdUNDQSxJQUFBIiwiZmlsZSI6ImF0dHJpYnV0ZXMvaGlnaGxpZ2h0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtEcmFmdH0gZnJvbSAnYXRyaWwnO1xuaW1wb3J0IGhqcyBmcm9tICdoaWdobGlnaHRqcyc7XG5cbkBEcmFmdCh7XG4gIGF0dHJpYnV0ZU5hbWU6ICdoaWdobGlnaHQnXG59KVxuY2xhc3MgQ3RybCB7XG4gIGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICAvLyBMYW5ndWFnZS5cbiAgaGludDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGxldCBjb250ZW50ID0gPERvY3VtZW50RnJhZ21lbnQ+KDxhbnk+dGhpcy5lbGVtZW50KS5jb250ZW50O1xuXG4gICAgY29uc29sZS5hc3NlcnQoY29udGVudC5maXJzdENoaWxkIGluc3RhbmNlb2YgSFRNTFByZUVsZW1lbnQsXG4gICAgICAgICAgICAgICAgICAgYCdoaWdobGlnaHQuKicgZXhwZWN0cyB0byBiZSB1c2VkIG9uIGEgPHByZT4gdGFnLCBnb3Q6YCwgY29udGVudC5maXJzdENoaWxkKTtcblxuICAgIGxldCBwcmUgPSA8SFRNTFByZUVsZW1lbnQ+Y29udGVudC5maXJzdENoaWxkO1xuXG4gICAgLy8gQ29udmVydCBleGlzdGluZyBjb250ZW50IGludG8gdGV4dC5cbiAgICBsZXQgcmVzdWx0ID0gdGhpcy5oaW50ID8gaGpzLmhpZ2hsaWdodCh0aGlzLmhpbnQsIHByZS5pbm5lckhUTUwpOiBoanMuaGlnaGxpZ2h0QXV0byhwcmUuaW5uZXJIVE1MKTtcblxuICAgIC8vIE5ldXRlciBpbnRlcnBvbGF0aW9ucy4gVGhpcyBpcyBuZWNlc3NhcnkgYmVjYXVzZSBhIGRyYWZ0J3Mgb3V0cHV0IGlzIHJlLVxuICAgIC8vIGNvbXBpbGVkLCBzbyBpbnRlcnBvbGF0aW9ucyB3b3VsZCBiZSBldmFsdWF0ZWQuXG4gICAgcmVzdWx0LnZhbHVlID0gcmVzdWx0LnZhbHVlLnJlcGxhY2UoL1xce1xceygoPzpbXn1dfH0oPz1bXn1dKSkqKVxcfVxcfS9nLCAne3s8c3Bhbj4kMTwvc3Bhbj59fScpO1xuXG4gICAgLy8gVHJhbnNmZXIgbm9ybWFsIGF0dHJpYnV0ZXMuXG4gICAgZm9yIChsZXQgaSA9IDAsIGlpID0gdGhpcy5lbGVtZW50LmF0dHJpYnV0ZXMubGVuZ3RoOyBpIDwgaWk7ICsraSkge1xuICAgICAgbGV0IGF0dHIgPSB0aGlzLmVsZW1lbnQuYXR0cmlidXRlc1tpXTtcbiAgICAgIGlmICghdGhpcy5sb29rc0xpa2VDdXN0b21BdHRyaWJ1dGUoYXR0ci5uYW1lKSkge1xuICAgICAgICBwcmUuc2V0QXR0cmlidXRlKGF0dHIubmFtZSwgYXR0ci52YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVuZGVyIGhpZ2hsaWdodGVkIGNvZGUuXG4gICAgcHJlLmlubmVySFRNTCA9IGA8Y29kZSBjbGFzcz1cImhsanMgbGFuZy0ke3Jlc3VsdC5sYW5ndWFnZX1cIj4ke3Jlc3VsdC52YWx1ZX08L2NvZGU+YDtcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQocHJlKTtcbiAgfVxuXG4gIGxvb2tzTGlrZUN1c3RvbUF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gL15bYS16LV0rXFwuLy50ZXN0KGF0dHJpYnV0ZU5hbWUpO1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=