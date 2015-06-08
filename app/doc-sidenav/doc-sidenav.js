var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};System.register(['atril'], function(exports_1) {
    var atril_1;
    var VM;
    return {
        setters:[
            function (_atril_1) {
                atril_1 = _atril_1;
            }],
        execute: function() {
            VM = (function () {
                function VM() {
                }
                VM.prototype.isActive = function (link) {
                    return ~location.pathname.indexOf(link) && !~location.pathname.indexOf(link + '/') ||
                        location.pathname === '/atril/' && link === '';
                };
                VM.prototype.onPhase = function () {
                    var anchors = this.element.querySelectorAll('a');
                    for (var i = anchors.length - 1; i >= 0; --i) {
                        var node = anchors[i];
                        if (this.isActive(node.getAttribute('href')))
                            node.classList.add('active');
                        else
                            node.classList.remove('active');
                    }
                };
                VM.viewUrl = 'app/doc-sidenav/doc-sidenav.html';
                VM = __decorate([
                    atril_1.Component({ tagName: 'doc-sidenav' })
                ], VM);
                return VM;
            })();
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRvYy1zaWRlbmF2L2RvYy1zaWRlbmF2LnRzIl0sIm5hbWVzIjpbIlZNIiwiVk0uY29uc3RydWN0b3IiLCJWTS5pc0FjdGl2ZSIsIlZNLm9uUGhhc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7WUFFQTtnQkFBQUE7Z0JBbUJBQyxDQUFDQTtnQkFmQ0QscUJBQVFBLEdBQVJBLFVBQVNBLElBQVlBO29CQUNuQkUsTUFBTUEsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsR0FBR0EsR0FBR0EsQ0FBQ0E7d0JBQzNFQSxRQUFRQSxDQUFDQSxRQUFRQSxLQUFLQSxTQUFTQSxJQUFJQSxJQUFJQSxLQUFLQSxFQUFFQSxDQUFDQTtnQkFDeERBLENBQUNBO2dCQUVERixvQkFBT0EsR0FBUEE7b0JBQ0VHLElBQUlBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLGdCQUFnQkEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2pEQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxPQUFPQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQTt3QkFDN0NBLElBQUlBLElBQUlBLEdBQXNCQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDekNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBOzRCQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxHQUFHQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTt3QkFDM0VBLElBQUlBOzRCQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtvQkFDdkNBLENBQUNBO2dCQUNIQSxDQUFDQTtnQkFFTUgsVUFBT0EsR0FBR0Esa0NBQWtDQSxDQUFDQTtnQkFsQnREQTtvQkFBQ0EsaUJBQVNBLENBQUNBLEVBQUNBLE9BQU9BLEVBQUVBLGFBQWFBLEVBQUNBLENBQUNBO3VCQW1CbkNBO2dCQUFEQSxTQUFDQTtZQUFEQSxDQW5CQSxBQW1CQ0EsSUFBQSIsImZpbGUiOiJkb2Mtc2lkZW5hdi9kb2Mtc2lkZW5hdi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50fSBmcm9tICdhdHJpbCc7XG5cbkBDb21wb25lbnQoe3RhZ05hbWU6ICdkb2Mtc2lkZW5hdid9KVxuY2xhc3MgVk0ge1xuICBlbGVtZW50OiBIVE1MRWxlbWVudDtcblxuICBpc0FjdGl2ZShsaW5rOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gfmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YobGluaykgJiYgIX5sb2NhdGlvbi5wYXRobmFtZS5pbmRleE9mKGxpbmsgKyAnLycpIHx8XG4gICAgICAgICAgIGxvY2F0aW9uLnBhdGhuYW1lID09PSAnL2F0cmlsLycgJiYgbGluayA9PT0gJyc7XG4gIH1cblxuICBvblBoYXNlKCkge1xuICAgIGxldCBhbmNob3JzID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2EnKTtcbiAgICBmb3IgKGxldCBpID0gYW5jaG9ycy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgbGV0IG5vZGUgPSA8SFRNTEFuY2hvckVsZW1lbnQ+YW5jaG9yc1tpXTtcbiAgICAgIGlmICh0aGlzLmlzQWN0aXZlKG5vZGUuZ2V0QXR0cmlidXRlKCdocmVmJykpKSBub2RlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgZWxzZSBub2RlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyB2aWV3VXJsID0gJ2FwcC9kb2Mtc2lkZW5hdi9kb2Mtc2lkZW5hdi5odG1sJztcbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==