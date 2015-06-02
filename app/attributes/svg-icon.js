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
                    this.element.appendChild(this.content.firstChild);
                    this.element.firstChild.innerHTML = view;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF0dHJpYnV0ZXMvc3ZnLWljb24udHMiXSwibmFtZXMiOlsiQ3RybCIsIkN0cmwuY29uc3RydWN0b3IiLCJDdHJsLmNvbW1pdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztZQUVBLEFBR0E7O2VBREc7O2dCQWFEQTtvQkFaRkMsaUJBNkJDQTtvQkFoQkdBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLFdBQVdBLEdBQUdBLElBQUlBLENBQUNBLElBQUlBLENBQUNBO29CQUN4Q0EsSUFBSUEsQ0FBQ0EsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0E7b0JBQ3BDQSxJQUFJQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtvQkFDeERBLElBQUlBLElBQUlBLEdBQUdBLFVBQVVBLEdBQUdBLFFBQVFBLEdBQUdBLE1BQU1BLENBQUNBO29CQUUxQ0EsSUFBSUEsSUFBSUEsR0FBR0EsaUJBQVNBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO29CQUMvQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsSUFBSUEsS0FBS0EsUUFBUUEsQ0FBQ0E7d0JBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLENBQUNBO29CQUNoREEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7d0JBQ0pBLGlCQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFBQSxJQUFJQSxJQUFJQSxPQUFBQSxLQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFqQkEsQ0FBaUJBLENBQUNBLENBQUNBO29CQUN2REEsQ0FBQ0E7Z0JBQ0hBLENBQUNBO2dCQUVERCxxQkFBTUEsR0FBTkEsVUFBT0EsSUFBWUE7b0JBQ2pCRSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxXQUFXQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtvQkFDcENBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFVBQVdBLENBQUNBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBO2dCQUMxREEsQ0FBQ0E7Z0JBNUJIRjtvQkFBQ0EsWUFBSUEsQ0FBQ0E7d0JBQ0pBLGFBQWFBLEVBQUVBLFVBQVVBO3FCQUMxQkEsQ0FBQ0E7eUJBMkJEQTtnQkFBREEsV0FBQ0E7WUFBREEsQ0E3QkEsQUE2QkNBLElBQUEiLCJmaWxlIjoiYXR0cmlidXRlcy9zdmctaWNvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TW9sZCwgdmlld0NhY2hlfSBmcm9tICdhdHJpbCc7XG5cbi8qKlxuICogU1ZHIGljb24gaGVscGVyIHdpdGggb3B0aW9uYWwgYXN5bmMgbG9hZGluZy5cbiAqL1xuQE1vbGQoe1xuICBhdHRyaWJ1dGVOYW1lOiAnc3ZnLWljb24nXG59KVxuY2xhc3MgQ3RybCB7XG4gIC8vIEF1dG9hc3NpZ25lZFxuICBlbGVtZW50OiBIVE1MVGVtcGxhdGVFbGVtZW50O1xuICBoaW50OiBzdHJpbmc7XG5cbiAgLy8gQ3VzdG9tXG4gIGF0dHJOYW1lOiBzdHJpbmc7XG4gIGNvbnRlbnQ6IERvY3VtZW50RnJhZ21lbnQ7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hdHRyTmFtZSA9ICdzdmctaWNvbi4nICsgdGhpcy5oaW50O1xuICAgIHRoaXMuY29udGVudCA9IHRoaXMuZWxlbWVudC5jb250ZW50O1xuICAgIGxldCBpY29uTmFtZSA9IHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUodGhpcy5hdHRyTmFtZSk7XG4gICAgbGV0IHBhdGggPSAnYXBwL3N2Zy8nICsgaWNvbk5hbWUgKyAnLnN2Zyc7XG5cbiAgICBsZXQgdmlldyA9IHZpZXdDYWNoZS5nZXQocGF0aCk7XG4gICAgaWYgKHR5cGVvZiB2aWV3ID09PSAnc3RyaW5nJykgdGhpcy5jb21taXQodmlldyk7XG4gICAgZWxzZSB7XG4gICAgICB2aWV3Q2FjaGUubG9hZChwYXRoKS50aGVuKHZpZXcgPT4gdGhpcy5jb21taXQodmlldykpO1xuICAgIH1cbiAgfVxuXG4gIGNvbW1pdCh2aWV3OiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5jb250ZW50LmZpcnN0Q2hpbGQpO1xuICAgICg8SFRNTEVsZW1lbnQ+dGhpcy5lbGVtZW50LmZpcnN0Q2hpbGQpLmlubmVySFRNTCA9IHZpZXc7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==