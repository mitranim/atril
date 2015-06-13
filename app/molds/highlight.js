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
                    // Reuse or create a <pre>.
                    var pre = content.firstChild instanceof HTMLPreElement ?
                        content.firstChild : document.createElement('pre');
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
                __decorate([
                    atril_1.assign
                ], Ctrl.prototype, "element");
                __decorate([
                    atril_1.assign
                ], Ctrl.prototype, "hint");
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vbGRzL2hpZ2hsaWdodC50cyJdLCJuYW1lcyI6WyJDdHJsIiwiQ3RybC5jb25zdHJ1Y3RvciIsIkN0cmwubG9va3NMaWtlQ3VzdG9tQXR0cmlidXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBR0E7Z0JBUUVBO29CQUNFQyxJQUFJQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQTtvQkFFbkNBLEFBQ0FBLDJCQUQyQkE7d0JBQ3ZCQSxHQUFHQSxHQUFHQSxPQUFPQSxDQUFDQSxVQUFVQSxZQUFZQSxjQUFjQTt3QkFDNUJBLE9BQU9BLENBQUNBLFVBQVVBLEdBQUdBLFFBQVFBLENBQUNBLGFBQWFBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO29CQUU3RUEsQUFDQUEsc0NBRHNDQTt3QkFDbENBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLHFCQUFHQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxHQUFHQSxDQUFDQSxTQUFTQSxDQUFDQSxHQUFFQSxxQkFBR0EsQ0FBQ0EsYUFBYUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7b0JBRW5HQSxBQUVBQSwwRUFGMEVBO29CQUMxRUEsa0RBQWtEQTtvQkFDbERBLE1BQU1BLENBQUNBLEtBQUtBLEdBQUdBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLE9BQU9BLENBQUNBLGdDQUFnQ0EsRUFBRUEscUJBQXFCQSxDQUFDQSxDQUFDQTtvQkFFN0ZBLEFBQ0FBLDhCQUQ4QkE7b0JBQzlCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQTt3QkFDakVBLElBQUlBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUN0Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0Esd0JBQXdCQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDOUNBLEdBQUdBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLEVBQUVBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO3dCQUMxQ0EsQ0FBQ0E7b0JBQ0hBLENBQUNBO29CQUVEQSxBQUNBQSwyQkFEMkJBO29CQUMzQkEsR0FBR0EsQ0FBQ0EsU0FBU0EsR0FBR0EsNkJBQTBCQSxNQUFNQSxDQUFDQSxRQUFRQSxXQUFLQSxNQUFNQSxDQUFDQSxLQUFLQSxZQUFTQSxDQUFDQTtvQkFDcEZBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFdBQVdBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO2dCQUNoQ0EsQ0FBQ0E7Z0JBRURELHVDQUF3QkEsR0FBeEJBLFVBQXlCQSxhQUFxQkE7b0JBQzVDRSxNQUFNQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxDQUFDQTtnQkFDMUNBLENBQUNBO2dCQWpDREY7b0JBQUNBLGNBQU1BO21CQUFDQSx5QkFBT0EsRUFBc0JBO2dCQUVyQ0E7b0JBQUNBLGNBQU1BO21CQUFDQSxzQkFBSUEsRUFBU0E7Z0JBTnZCQTtvQkFBQ0EsWUFBSUEsQ0FBQ0E7d0JBQ0pBLGFBQWFBLEVBQUVBLFdBQVdBO3FCQUMzQkEsQ0FBQ0E7eUJBb0NEQTtnQkFBREEsV0FBQ0E7WUFBREEsQ0F0Q0EsQUFzQ0NBLElBQUEiLCJmaWxlIjoibW9sZHMvaGlnaGxpZ2h0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtNb2xkLCBhc3NpZ259IGZyb20gJ2F0cmlsJztcbmltcG9ydCBoanMgZnJvbSAnaGlnaGxpZ2h0anMnO1xuXG5ATW9sZCh7XG4gIGF0dHJpYnV0ZU5hbWU6ICdoaWdobGlnaHQnXG59KVxuY2xhc3MgQ3RybCB7XG4gIEBhc3NpZ24gZWxlbWVudDogSFRNTFRlbXBsYXRlRWxlbWVudDtcbiAgLy8gTGFuZ3VhZ2UuXG4gIEBhc3NpZ24gaGludDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGxldCBjb250ZW50ID0gdGhpcy5lbGVtZW50LmNvbnRlbnQ7XG5cbiAgICAvLyBSZXVzZSBvciBjcmVhdGUgYSA8cHJlPi5cbiAgICBsZXQgcHJlID0gY29udGVudC5maXJzdENoaWxkIGluc3RhbmNlb2YgSFRNTFByZUVsZW1lbnQgP1xuICAgICAgICAgICAgICA8SFRNTFByZUVsZW1lbnQ+Y29udGVudC5maXJzdENoaWxkIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncHJlJyk7XG5cbiAgICAvLyBDb252ZXJ0IGV4aXN0aW5nIGNvbnRlbnQgaW50byB0ZXh0LlxuICAgIGxldCByZXN1bHQgPSB0aGlzLmhpbnQgPyBoanMuaGlnaGxpZ2h0KHRoaXMuaGludCwgcHJlLmlubmVySFRNTCk6IGhqcy5oaWdobGlnaHRBdXRvKHByZS5pbm5lckhUTUwpO1xuXG4gICAgLy8gTmV1dGVyIGludGVycG9sYXRpb25zLiBUaGlzIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIGEgbW9sZCdzIG91dHB1dCBpcyByZS1cbiAgICAvLyBjb21waWxlZCwgc28gaW50ZXJwb2xhdGlvbnMgd291bGQgYmUgZXZhbHVhdGVkLlxuICAgIHJlc3VsdC52YWx1ZSA9IHJlc3VsdC52YWx1ZS5yZXBsYWNlKC9cXHtcXHsoKD86W159XXx9KD89W159XSkpKilcXH1cXH0vZywgJ3t7PHNwYW4+JDE8L3NwYW4+fX0nKTtcblxuICAgIC8vIFRyYW5zZmVyIG5vcm1hbCBhdHRyaWJ1dGVzLlxuICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHRoaXMuZWxlbWVudC5hdHRyaWJ1dGVzLmxlbmd0aDsgaSA8IGlpOyArK2kpIHtcbiAgICAgIGxldCBhdHRyID0gdGhpcy5lbGVtZW50LmF0dHJpYnV0ZXNbaV07XG4gICAgICBpZiAoIXRoaXMubG9va3NMaWtlQ3VzdG9tQXR0cmlidXRlKGF0dHIubmFtZSkpIHtcbiAgICAgICAgcHJlLnNldEF0dHJpYnV0ZShhdHRyLm5hbWUsIGF0dHIudmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJlbmRlciBoaWdobGlnaHRlZCBjb2RlLlxuICAgIHByZS5pbm5lckhUTUwgPSBgPGNvZGUgY2xhc3M9XCJobGpzIGxhbmctJHtyZXN1bHQubGFuZ3VhZ2V9XCI+JHtyZXN1bHQudmFsdWV9PC9jb2RlPmA7XG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHByZSk7XG4gIH1cblxuICBsb29rc0xpa2VDdXN0b21BdHRyaWJ1dGUoYXR0cmlidXRlTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIC9eW2Etei1dK1xcLi8udGVzdChhdHRyaWJ1dGVOYW1lKTtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9