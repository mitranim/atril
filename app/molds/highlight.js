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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vbGRzL2hpZ2hsaWdodC50cyJdLCJuYW1lcyI6WyJDdHJsIiwiQ3RybC5jb25zdHJ1Y3RvciIsIkN0cmwubG9va3NMaWtlQ3VzdG9tQXR0cmlidXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBR0E7Z0JBUUVBO29CQUNFQyxJQUFJQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQTtvQkFFbkNBLEFBQ0FBLDJCQUQyQkE7d0JBQ3ZCQSxHQUFHQSxHQUFHQSxPQUFPQSxDQUFDQSxVQUFVQSxZQUFZQSxjQUFjQTt3QkFDNUJBLE9BQU9BLENBQUNBLFVBQVVBLEdBQUdBLFFBQVFBLENBQUNBLGFBQWFBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO29CQUU3RUEsQUFDQUEsc0NBRHNDQTt3QkFDbENBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLHFCQUFHQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxHQUFHQSxDQUFDQSxTQUFTQSxDQUFDQSxHQUFFQSxxQkFBR0EsQ0FBQ0EsYUFBYUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7b0JBRW5HQSxBQUVBQSwwRUFGMEVBO29CQUMxRUEsa0RBQWtEQTtvQkFDbERBLE1BQU1BLENBQUNBLEtBQUtBLEdBQUdBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLE9BQU9BLENBQUNBLGdDQUFnQ0EsRUFBRUEscUJBQXFCQSxDQUFDQSxDQUFDQTtvQkFFN0ZBLEFBQ0FBLDhCQUQ4QkE7b0JBQzlCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxVQUFVQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQTt3QkFDakVBLElBQUlBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUN0Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0Esd0JBQXdCQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDOUNBLEdBQUdBLENBQUNBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLEVBQUVBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO3dCQUMxQ0EsQ0FBQ0E7b0JBQ0hBLENBQUNBO29CQUVEQSxBQUNBQSwyQkFEMkJBO29CQUMzQkEsR0FBR0EsQ0FBQ0EsU0FBU0EsR0FBR0EsNkJBQTBCQSxNQUFNQSxDQUFDQSxRQUFRQSxXQUFLQSxNQUFNQSxDQUFDQSxLQUFLQSxZQUFTQSxDQUFDQTtvQkFDcEZBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFdBQVdBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO2dCQUNoQ0EsQ0FBQ0E7Z0JBRURELHVDQUF3QkEsR0FBeEJBLFVBQXlCQSxhQUFxQkE7b0JBQzVDRSxNQUFNQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxDQUFDQTtnQkFDMUNBLENBQUNBO2dCQXJDSEY7b0JBQUNBLFlBQUlBLENBQUNBO3dCQUNKQSxhQUFhQSxFQUFFQSxXQUFXQTtxQkFDM0JBLENBQUNBO3lCQW9DREE7Z0JBQURBLFdBQUNBO1lBQURBLENBdENBLEFBc0NDQSxJQUFBIiwiZmlsZSI6Im1vbGRzL2hpZ2hsaWdodC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TW9sZH0gZnJvbSAnYXRyaWwnO1xuaW1wb3J0IGhqcyBmcm9tICdoaWdobGlnaHRqcyc7XG5cbkBNb2xkKHtcbiAgYXR0cmlidXRlTmFtZTogJ2hpZ2hsaWdodCdcbn0pXG5jbGFzcyBDdHJsIHtcbiAgZWxlbWVudDogSFRNTFRlbXBsYXRlRWxlbWVudDtcbiAgLy8gTGFuZ3VhZ2UuXG4gIGhpbnQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBsZXQgY29udGVudCA9IHRoaXMuZWxlbWVudC5jb250ZW50O1xuXG4gICAgLy8gUmV1c2Ugb3IgY3JlYXRlIGEgPHByZT4uXG4gICAgbGV0IHByZSA9IGNvbnRlbnQuZmlyc3RDaGlsZCBpbnN0YW5jZW9mIEhUTUxQcmVFbGVtZW50ID9cbiAgICAgICAgICAgICAgPEhUTUxQcmVFbGVtZW50PmNvbnRlbnQuZmlyc3RDaGlsZCA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ByZScpO1xuXG4gICAgLy8gQ29udmVydCBleGlzdGluZyBjb250ZW50IGludG8gdGV4dC5cbiAgICBsZXQgcmVzdWx0ID0gdGhpcy5oaW50ID8gaGpzLmhpZ2hsaWdodCh0aGlzLmhpbnQsIHByZS5pbm5lckhUTUwpOiBoanMuaGlnaGxpZ2h0QXV0byhwcmUuaW5uZXJIVE1MKTtcblxuICAgIC8vIE5ldXRlciBpbnRlcnBvbGF0aW9ucy4gVGhpcyBpcyBuZWNlc3NhcnkgYmVjYXVzZSBhIG1vbGQncyBvdXRwdXQgaXMgcmUtXG4gICAgLy8gY29tcGlsZWQsIHNvIGludGVycG9sYXRpb25zIHdvdWxkIGJlIGV2YWx1YXRlZC5cbiAgICByZXN1bHQudmFsdWUgPSByZXN1bHQudmFsdWUucmVwbGFjZSgvXFx7XFx7KCg/OltefV18fSg/PVtefV0pKSopXFx9XFx9L2csICd7ezxzcGFuPiQxPC9zcGFuPn19Jyk7XG5cbiAgICAvLyBUcmFuc2ZlciBub3JtYWwgYXR0cmlidXRlcy5cbiAgICBmb3IgKGxldCBpID0gMCwgaWkgPSB0aGlzLmVsZW1lbnQuYXR0cmlidXRlcy5sZW5ndGg7IGkgPCBpaTsgKytpKSB7XG4gICAgICBsZXQgYXR0ciA9IHRoaXMuZWxlbWVudC5hdHRyaWJ1dGVzW2ldO1xuICAgICAgaWYgKCF0aGlzLmxvb2tzTGlrZUN1c3RvbUF0dHJpYnV0ZShhdHRyLm5hbWUpKSB7XG4gICAgICAgIHByZS5zZXRBdHRyaWJ1dGUoYXR0ci5uYW1lLCBhdHRyLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZW5kZXIgaGlnaGxpZ2h0ZWQgY29kZS5cbiAgICBwcmUuaW5uZXJIVE1MID0gYDxjb2RlIGNsYXNzPVwiaGxqcyBsYW5nLSR7cmVzdWx0Lmxhbmd1YWdlfVwiPiR7cmVzdWx0LnZhbHVlfTwvY29kZT5gO1xuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChwcmUpO1xuICB9XG5cbiAgbG9va3NMaWtlQ3VzdG9tQXR0cmlidXRlKGF0dHJpYnV0ZU5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAvXlthLXotXStcXC4vLnRlc3QoYXR0cmlidXRlTmFtZSk7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==