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
                    // Expecting no pushstate transitions.
                    this.onPhase = null;
                };
                VM.templateUrl = 'app/doc-sidenav/doc-sidenav.html';
                VM = __decorate([
                    atril_1.Component({ tagName: 'doc-sidenav' })
                ], VM);
                return VM;
            })();
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRvYy1zaWRlbmF2L2RvYy1zaWRlbmF2LnRzIl0sIm5hbWVzIjpbIlZNIiwiVk0uY29uc3RydWN0b3IiLCJWTS5pc0FjdGl2ZSIsIlZNLm9uUGhhc2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7WUFFQTtnQkFBQUE7Z0JBcUJBQyxDQUFDQTtnQkFqQkNELHFCQUFRQSxHQUFSQSxVQUFTQSxJQUFZQTtvQkFDbkJFLE1BQU1BLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLFFBQVFBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLFFBQVFBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLEdBQUdBLEdBQUdBLENBQUNBO3dCQUMzRUEsUUFBUUEsQ0FBQ0EsUUFBUUEsS0FBS0EsU0FBU0EsSUFBSUEsSUFBSUEsS0FBS0EsRUFBRUEsQ0FBQ0E7Z0JBQ3hEQSxDQUFDQTtnQkFFREYsb0JBQU9BLEdBQVBBO29CQUNFRyxJQUFJQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxnQkFBZ0JBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO29CQUNqREEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsT0FBT0EsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7d0JBQzdDQSxJQUFJQSxJQUFJQSxHQUFzQkEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3pDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7d0JBQzNFQSxJQUFJQTs0QkFBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7b0JBQ3ZDQSxDQUFDQTtvQkFDREEsQUFDQUEsc0NBRHNDQTtvQkFDdENBLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBO2dCQUN0QkEsQ0FBQ0E7Z0JBRU1ILGNBQVdBLEdBQUdBLGtDQUFrQ0EsQ0FBQ0E7Z0JBcEIxREE7b0JBQUNBLGlCQUFTQSxDQUFDQSxFQUFDQSxPQUFPQSxFQUFFQSxhQUFhQSxFQUFDQSxDQUFDQTt1QkFxQm5DQTtnQkFBREEsU0FBQ0E7WUFBREEsQ0FyQkEsQUFxQkNBLElBQUEiLCJmaWxlIjoiZG9jLXNpZGVuYXYvZG9jLXNpZGVuYXYuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSAnYXRyaWwnO1xuXG5AQ29tcG9uZW50KHt0YWdOYW1lOiAnZG9jLXNpZGVuYXYnfSlcbmNsYXNzIFZNIHtcbiAgZWxlbWVudDogSFRNTEVsZW1lbnQ7XG5cbiAgaXNBY3RpdmUobGluazogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIH5sb2NhdGlvbi5wYXRobmFtZS5pbmRleE9mKGxpbmspICYmICF+bG9jYXRpb24ucGF0aG5hbWUuaW5kZXhPZihsaW5rICsgJy8nKSB8fFxuICAgICAgICAgICBsb2NhdGlvbi5wYXRobmFtZSA9PT0gJy9hdHJpbC8nICYmIGxpbmsgPT09ICcnO1xuICB9XG5cbiAgb25QaGFzZSgpIHtcbiAgICBsZXQgYW5jaG9ycyA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdhJyk7XG4gICAgZm9yIChsZXQgaSA9IGFuY2hvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIGxldCBub2RlID0gPEhUTUxBbmNob3JFbGVtZW50PmFuY2hvcnNbaV07XG4gICAgICBpZiAodGhpcy5pc0FjdGl2ZShub2RlLmdldEF0dHJpYnV0ZSgnaHJlZicpKSkgbm9kZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgIGVsc2Ugbm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICB9XG4gICAgLy8gRXhwZWN0aW5nIG5vIHB1c2hzdGF0ZSB0cmFuc2l0aW9ucy5cbiAgICB0aGlzLm9uUGhhc2UgPSBudWxsO1xuICB9XG5cbiAgc3RhdGljIHRlbXBsYXRlVXJsID0gJ2FwcC9kb2Mtc2lkZW5hdi9kb2Mtc2lkZW5hdi5odG1sJztcbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==