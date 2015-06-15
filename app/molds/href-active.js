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
                    atril_1.Mold({ attributeName: 'href-active' })
                ], Ctrl);
                return Ctrl;
            })();
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vbGRzL2hyZWYtYWN0aXZlLnRzIl0sIm5hbWVzIjpbIkN0cmwiLCJDdHJsLmNvbnN0cnVjdG9yIiwiQ3RybC5pc0FjdGl2ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztZQUVBO2dCQUtFQTtvQkFDRUMsSUFBSUEsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0E7b0JBRW5DQSxPQUFPQSxPQUFPQSxDQUFDQSxhQUFhQSxFQUFFQSxFQUFFQSxDQUFDQTt3QkFDL0JBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFdBQVdBLENBQUNBLE9BQU9BLENBQUNBLFdBQVdBLENBQUNBLE9BQU9BLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBO29CQUNwRUEsQ0FBQ0E7b0JBRURBLElBQUlBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLGdCQUFnQkEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2pEQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxPQUFPQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQTt3QkFDN0NBLElBQUlBLElBQUlBLEdBQXNCQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDekNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBOzRCQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTt3QkFDNUVBLElBQUlBOzRCQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDeENBLENBQUNBO2dCQUNIQSxDQUFDQTtnQkFFREQsdUJBQVFBLEdBQVJBLFVBQVNBLElBQVlBO29CQUNuQkUsTUFBTUEsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsR0FBR0EsR0FBR0EsQ0FBQ0E7d0JBQzNFQSxRQUFRQSxDQUFDQSxRQUFRQSxLQUFLQSxTQUFTQSxJQUFJQSxJQUFJQSxLQUFLQSxFQUFFQSxDQUFDQTtnQkFDeERBLENBQUNBO2dCQXJCREY7b0JBQUNBLGNBQU1BO21CQUFDQSx5QkFBT0EsRUFBc0JBO2dCQUNyQ0E7b0JBQUNBLGNBQU1BO21CQUFDQSxzQkFBSUEsRUFBU0E7Z0JBSHZCQTtvQkFBQ0EsWUFBSUEsQ0FBQ0EsRUFBQ0EsYUFBYUEsRUFBRUEsYUFBYUEsRUFBQ0EsQ0FBQ0E7eUJBd0JwQ0E7Z0JBQURBLFdBQUNBO1lBQURBLENBeEJBLEFBd0JDQSxJQUFBIiwiZmlsZSI6Im1vbGRzL2hyZWYtYWN0aXZlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtNb2xkLCBhc3NpZ259IGZyb20gJ2F0cmlsJztcblxuQE1vbGQoe2F0dHJpYnV0ZU5hbWU6ICdocmVmLWFjdGl2ZSd9KVxuY2xhc3MgQ3RybCB7XG4gIEBhc3NpZ24gZWxlbWVudDogSFRNTFRlbXBsYXRlRWxlbWVudDtcbiAgQGFzc2lnbiBoaW50OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgbGV0IGNvbnRlbnQgPSB0aGlzLmVsZW1lbnQuY29udGVudDtcblxuICAgIHdoaWxlIChjb250ZW50Lmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKGNvbnRlbnQucmVtb3ZlQ2hpbGQoY29udGVudC5maXJzdENoaWxkKSk7XG4gICAgfVxuXG4gICAgbGV0IGFuY2hvcnMgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnYScpO1xuICAgIGZvciAobGV0IGkgPSBhbmNob3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICBsZXQgbm9kZSA9IDxIVE1MQW5jaG9yRWxlbWVudD5hbmNob3JzW2ldO1xuICAgICAgaWYgKHRoaXMuaXNBY3RpdmUobm9kZS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSkpIG5vZGUuY2xhc3NMaXN0LmFkZCh0aGlzLmhpbnQpO1xuICAgICAgZWxzZSBub2RlLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5oaW50KTtcbiAgICB9XG4gIH1cblxuICBpc0FjdGl2ZShsaW5rOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gfmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YobGluaykgJiYgIX5sb2NhdGlvbi5wYXRobmFtZS5pbmRleE9mKGxpbmsgKyAnLycpIHx8XG4gICAgICAgICAgIGxvY2F0aW9uLnBhdGhuYW1lID09PSAnL2F0cmlsLycgJiYgbGluayA9PT0gJyc7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==