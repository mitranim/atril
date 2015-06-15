var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};System.register(['atril'], function(exports_1) {
    var atril_1;
    var Ctrl;
    return {
        setters:[
            function (_atril_1) {
                atril_1 = _atril_1;
            }],
        execute: function() {
            Ctrl = (function () {
                function Ctrl() {
                    var content = this.element.content;
                    while (content.hasChildNodes()) {
                        this.element.appendChild(content.removeChild(content.firstChild));
                    }
                    var anchors = this.element.querySelectorAll('a');
                    for (var i = anchors.length - 1; i >= 0; --i) {
                        var node = anchors[i];
                        if (this.isActive(node.getAttribute('href')))
                            node.classList.add(this.hint);
                        else
                            node.classList.remove(this.hint);
                    }
                }
                Ctrl.prototype.isActive = function (link) {
                    return ~location.pathname.indexOf(link) && !~location.pathname.indexOf(link + '/') ||
                        location.pathname === '/atril/' && link === '';
                };
                __decorate([
                    atril_1.assign
                ], Ctrl.prototype, "element");
                __decorate([
                    atril_1.assign
                ], Ctrl.prototype, "hint");
                Ctrl = __decorate([
                    atril_1.Mold({ attributeName: 'mark-href' })
                ], Ctrl);
                return Ctrl;
            })();
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vbGRzL21hcmstaHJlZi50cyJdLCJuYW1lcyI6WyJDdHJsIiwiQ3RybC5jb25zdHJ1Y3RvciIsIkN0cmwuaXNBY3RpdmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7WUFFQTtnQkFLRUE7b0JBQ0VDLElBQUlBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBO29CQUVuQ0EsT0FBT0EsT0FBT0EsQ0FBQ0EsYUFBYUEsRUFBRUEsRUFBRUEsQ0FBQ0E7d0JBQy9CQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxXQUFXQSxDQUFDQSxPQUFPQSxDQUFDQSxXQUFXQSxDQUFDQSxPQUFPQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDcEVBLENBQUNBO29CQUVEQSxJQUFJQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxnQkFBZ0JBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO29CQUNqREEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsT0FBT0EsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7d0JBQzdDQSxJQUFJQSxJQUFJQSxHQUFzQkEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3pDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7d0JBQzVFQSxJQUFJQTs0QkFBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7b0JBQ3hDQSxDQUFDQTtnQkFDSEEsQ0FBQ0E7Z0JBRURELHVCQUFRQSxHQUFSQSxVQUFTQSxJQUFZQTtvQkFDbkJFLE1BQU1BLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLFFBQVFBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLFFBQVFBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLEdBQUdBLEdBQUdBLENBQUNBO3dCQUMzRUEsUUFBUUEsQ0FBQ0EsUUFBUUEsS0FBS0EsU0FBU0EsSUFBSUEsSUFBSUEsS0FBS0EsRUFBRUEsQ0FBQ0E7Z0JBQ3hEQSxDQUFDQTtnQkFyQkRGO29CQUFDQSxjQUFNQTttQkFBQ0EseUJBQU9BLEVBQXNCQTtnQkFDckNBO29CQUFDQSxjQUFNQTttQkFBQ0Esc0JBQUlBLEVBQVNBO2dCQUh2QkE7b0JBQUNBLFlBQUlBLENBQUNBLEVBQUNBLGFBQWFBLEVBQUVBLFdBQVdBLEVBQUNBLENBQUNBO3lCQXdCbENBO2dCQUFEQSxXQUFDQTtZQUFEQSxDQXhCQSxBQXdCQ0EsSUFBQSIsImZpbGUiOiJtb2xkcy9tYXJrLWhyZWYuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge01vbGQsIGFzc2lnbn0gZnJvbSAnYXRyaWwnO1xuXG5ATW9sZCh7YXR0cmlidXRlTmFtZTogJ21hcmstaHJlZid9KVxuY2xhc3MgQ3RybCB7XG4gIEBhc3NpZ24gZWxlbWVudDogSFRNTFRlbXBsYXRlRWxlbWVudDtcbiAgQGFzc2lnbiBoaW50OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgbGV0IGNvbnRlbnQgPSB0aGlzLmVsZW1lbnQuY29udGVudDtcblxuICAgIHdoaWxlIChjb250ZW50Lmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKGNvbnRlbnQucmVtb3ZlQ2hpbGQoY29udGVudC5maXJzdENoaWxkKSk7XG4gICAgfVxuXG4gICAgbGV0IGFuY2hvcnMgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnYScpO1xuICAgIGZvciAobGV0IGkgPSBhbmNob3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICBsZXQgbm9kZSA9IDxIVE1MQW5jaG9yRWxlbWVudD5hbmNob3JzW2ldO1xuICAgICAgaWYgKHRoaXMuaXNBY3RpdmUobm9kZS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSkpIG5vZGUuY2xhc3NMaXN0LmFkZCh0aGlzLmhpbnQpO1xuICAgICAgZWxzZSBub2RlLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5oaW50KTtcbiAgICB9XG4gIH1cblxuICBpc0FjdGl2ZShsaW5rOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gfmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YobGluaykgJiYgIX5sb2NhdGlvbi5wYXRobmFtZS5pbmRleE9mKGxpbmsgKyAnLycpIHx8XG4gICAgICAgICAgIGxvY2F0aW9uLnBhdGhuYW1lID09PSAnL2F0cmlsLycgJiYgbGluayA9PT0gJyc7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==