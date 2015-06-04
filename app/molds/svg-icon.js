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
            /**
             * SVG icon helper with optional async loading.
             */
            Ctrl = (function () {
                function Ctrl() {
                    var _this = this;
                    this.attrName = 'svg-icon.' + this.hint;
                    this.content = this.element.content;
                    var iconName = this.element.getAttribute(this.attrName);
                    var path = 'app/svg/' + iconName + '.svg';
                    var view = atril_1.viewCache.get(path);
                    if (typeof view === 'string')
                        this.commit(view);
                    else {
                        atril_1.viewCache.load(path).then(function (view) { return _this.commit(view); });
                    }
                }
                Ctrl.prototype.commit = function (view) {
                    var child = this.content.firstChild;
                    this.element.appendChild(this.content.removeChild(child));
                    if (child.tagName !== 'sf-icon')
                        child.classList.add('sf-icon');
                    child.innerHTML = view;
                };
                Ctrl = __decorate([
                    atril_1.Mold({
                        attributeName: 'svg-icon'
                    })
                ], Ctrl);
                return Ctrl;
            })();
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vbGRzL3N2Zy1pY29uLnRzIl0sIm5hbWVzIjpbIkN0cmwiLCJDdHJsLmNvbnN0cnVjdG9yIiwiQ3RybC5jb21taXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7WUFFQSxBQUdBOztlQURHOztnQkFhREE7b0JBWkZDLGlCQStCQ0E7b0JBbEJHQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxXQUFXQSxHQUFHQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQTtvQkFDeENBLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBO29CQUNwQ0EsSUFBSUEsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7b0JBQ3hEQSxJQUFJQSxJQUFJQSxHQUFHQSxVQUFVQSxHQUFHQSxRQUFRQSxHQUFHQSxNQUFNQSxDQUFDQTtvQkFFMUNBLElBQUlBLElBQUlBLEdBQUdBLGlCQUFTQSxDQUFDQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDL0JBLEVBQUVBLENBQUNBLENBQUNBLE9BQU9BLElBQUlBLEtBQUtBLFFBQVFBLENBQUNBO3dCQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDaERBLElBQUlBLENBQUNBLENBQUNBO3dCQUNKQSxpQkFBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBQUEsSUFBSUEsSUFBSUEsT0FBQUEsS0FBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBakJBLENBQWlCQSxDQUFDQSxDQUFDQTtvQkFDdkRBLENBQUNBO2dCQUNIQSxDQUFDQTtnQkFFREQscUJBQU1BLEdBQU5BLFVBQU9BLElBQVlBO29CQUNqQkUsSUFBSUEsS0FBS0EsR0FBZ0JBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFVBQVVBLENBQUNBO29CQUNqREEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzFEQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxPQUFPQSxLQUFLQSxTQUFTQSxDQUFDQTt3QkFBQ0EsS0FBS0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2hFQSxLQUFLQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSxDQUFDQTtnQkFDekJBLENBQUNBO2dCQTlCSEY7b0JBQUNBLFlBQUlBLENBQUNBO3dCQUNKQSxhQUFhQSxFQUFFQSxVQUFVQTtxQkFDMUJBLENBQUNBO3lCQTZCREE7Z0JBQURBLFdBQUNBO1lBQURBLENBL0JBLEFBK0JDQSxJQUFBIiwiZmlsZSI6Im1vbGRzL3N2Zy1pY29uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtNb2xkLCB2aWV3Q2FjaGV9IGZyb20gJ2F0cmlsJztcblxuLyoqXG4gKiBTVkcgaWNvbiBoZWxwZXIgd2l0aCBvcHRpb25hbCBhc3luYyBsb2FkaW5nLlxuICovXG5ATW9sZCh7XG4gIGF0dHJpYnV0ZU5hbWU6ICdzdmctaWNvbidcbn0pXG5jbGFzcyBDdHJsIHtcbiAgLy8gQXV0b2Fzc2lnbmVkXG4gIGVsZW1lbnQ6IEhUTUxUZW1wbGF0ZUVsZW1lbnQ7XG4gIGhpbnQ6IHN0cmluZztcblxuICAvLyBDdXN0b21cbiAgYXR0ck5hbWU6IHN0cmluZztcbiAgY29udGVudDogRG9jdW1lbnRGcmFnbWVudDtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmF0dHJOYW1lID0gJ3N2Zy1pY29uLicgKyB0aGlzLmhpbnQ7XG4gICAgdGhpcy5jb250ZW50ID0gdGhpcy5lbGVtZW50LmNvbnRlbnQ7XG4gICAgbGV0IGljb25OYW1lID0gdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSh0aGlzLmF0dHJOYW1lKTtcbiAgICBsZXQgcGF0aCA9ICdhcHAvc3ZnLycgKyBpY29uTmFtZSArICcuc3ZnJztcblxuICAgIGxldCB2aWV3ID0gdmlld0NhY2hlLmdldChwYXRoKTtcbiAgICBpZiAodHlwZW9mIHZpZXcgPT09ICdzdHJpbmcnKSB0aGlzLmNvbW1pdCh2aWV3KTtcbiAgICBlbHNlIHtcbiAgICAgIHZpZXdDYWNoZS5sb2FkKHBhdGgpLnRoZW4odmlldyA9PiB0aGlzLmNvbW1pdCh2aWV3KSk7XG4gICAgfVxuICB9XG5cbiAgY29tbWl0KHZpZXc6IHN0cmluZyk6IHZvaWQge1xuICAgIGxldCBjaGlsZCA9IDxIVE1MRWxlbWVudD50aGlzLmNvbnRlbnQuZmlyc3RDaGlsZDtcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5jb250ZW50LnJlbW92ZUNoaWxkKGNoaWxkKSk7XG4gICAgaWYgKGNoaWxkLnRhZ05hbWUgIT09ICdzZi1pY29uJykgY2hpbGQuY2xhc3NMaXN0LmFkZCgnc2YtaWNvbicpO1xuICAgIGNoaWxkLmlubmVySFRNTCA9IHZpZXc7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==