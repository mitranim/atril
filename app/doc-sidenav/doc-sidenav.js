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
                VM.prototype.phase = function () {
                    var anchors = this.element.querySelectorAll('a');
                    for (var i = anchors.length - 1; i >= 0; --i) {
                        var node = anchors[i];
                        if (this.isActive(node.getAttribute('href')))
                            node.classList.add('active');
                        else
                            node.classList.remove('active');
                    }
                    // Expecting no pushstate transitions.
                    this.phase = null;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRvYy1zaWRlbmF2L2RvYy1zaWRlbmF2LnRzIl0sIm5hbWVzIjpbIlZNIiwiVk0uY29uc3RydWN0b3IiLCJWTS5pc0FjdGl2ZSIsIlZNLnBoYXNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O1lBRUE7Z0JBQUFBO2dCQXFCQUMsQ0FBQ0E7Z0JBakJDRCxxQkFBUUEsR0FBUkEsVUFBU0EsSUFBWUE7b0JBQ25CRSxNQUFNQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSxRQUFRQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSxRQUFRQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxHQUFHQSxHQUFHQSxDQUFDQTt3QkFDM0VBLFFBQVFBLENBQUNBLFFBQVFBLEtBQUtBLFNBQVNBLElBQUlBLElBQUlBLEtBQUtBLEVBQUVBLENBQUNBO2dCQUN4REEsQ0FBQ0E7Z0JBRURGLGtCQUFLQSxHQUFMQTtvQkFDRUcsSUFBSUEsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDakRBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLE9BQU9BLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBO3dCQUM3Q0EsSUFBSUEsSUFBSUEsR0FBc0JBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUN6Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLEdBQUdBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO3dCQUMzRUEsSUFBSUE7NEJBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO29CQUN2Q0EsQ0FBQ0E7b0JBQ0RBLEFBQ0FBLHNDQURzQ0E7b0JBQ3RDQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQTtnQkFDcEJBLENBQUNBO2dCQUVNSCxjQUFXQSxHQUFHQSxrQ0FBa0NBLENBQUNBO2dCQXBCMURBO29CQUFDQSxpQkFBU0EsQ0FBQ0EsRUFBQ0EsT0FBT0EsRUFBRUEsYUFBYUEsRUFBQ0EsQ0FBQ0E7dUJBcUJuQ0E7Z0JBQURBLFNBQUNBO1lBQURBLENBckJBLEFBcUJDQSxJQUFBIiwiZmlsZSI6ImRvYy1zaWRlbmF2L2RvYy1zaWRlbmF2LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnR9IGZyb20gJ2F0cmlsJztcblxuQENvbXBvbmVudCh7dGFnTmFtZTogJ2RvYy1zaWRlbmF2J30pXG5jbGFzcyBWTSB7XG4gIGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuXG4gIGlzQWN0aXZlKGxpbms6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB+bG9jYXRpb24ucGF0aG5hbWUuaW5kZXhPZihsaW5rKSAmJiAhfmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YobGluayArICcvJykgfHxcbiAgICAgICAgICAgbG9jYXRpb24ucGF0aG5hbWUgPT09ICcvYXRyaWwvJyAmJiBsaW5rID09PSAnJztcbiAgfVxuXG4gIHBoYXNlKCkge1xuICAgIGxldCBhbmNob3JzID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2EnKTtcbiAgICBmb3IgKGxldCBpID0gYW5jaG9ycy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgbGV0IG5vZGUgPSA8SFRNTEFuY2hvckVsZW1lbnQ+YW5jaG9yc1tpXTtcbiAgICAgIGlmICh0aGlzLmlzQWN0aXZlKG5vZGUuZ2V0QXR0cmlidXRlKCdocmVmJykpKSBub2RlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgZWxzZSBub2RlLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgIH1cbiAgICAvLyBFeHBlY3Rpbmcgbm8gcHVzaHN0YXRlIHRyYW5zaXRpb25zLlxuICAgIHRoaXMucGhhc2UgPSBudWxsO1xuICB9XG5cbiAgc3RhdGljIHRlbXBsYXRlVXJsID0gJ2FwcC9kb2Mtc2lkZW5hdi9kb2Mtc2lkZW5hdi5odG1sJztcbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==