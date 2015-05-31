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
                    var template = atril_1.templateCache.get(path);
                    if (typeof template === 'string')
                        this.commit(template);
                    else {
                        atril_1.templateCache.load(path).then(function (template) { return _this.commit(template); });
                    }
                }
                Ctrl.prototype.commit = function (template) {
                    this.element.appendChild(this.content.firstChild);
                    this.element.firstChild.innerHTML = template;
                };
                Ctrl = __decorate([
                    atril_1.Draft({
                        attributeName: 'svg-icon'
                    })
                ], Ctrl);
                return Ctrl;
            })();
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF0dHJpYnV0ZXMvc3ZnLWljb24udHMiXSwibmFtZXMiOlsiQ3RybCIsIkN0cmwuY29uc3RydWN0b3IiLCJDdHJsLmNvbW1pdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztZQUVBLEFBR0E7O2VBREc7O2dCQWFEQTtvQkFaRkMsaUJBNkJDQTtvQkFoQkdBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLFdBQVdBLEdBQUdBLElBQUlBLENBQUNBLElBQUlBLENBQUNBO29CQUN4Q0EsSUFBSUEsQ0FBQ0EsT0FBT0EsR0FBMkJBLElBQUlBLENBQUNBLE9BQVFBLENBQUNBLE9BQU9BLENBQUNBO29CQUM3REEsSUFBSUEsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7b0JBQ3hEQSxJQUFJQSxJQUFJQSxHQUFHQSxVQUFVQSxHQUFHQSxRQUFRQSxHQUFHQSxNQUFNQSxDQUFDQTtvQkFFMUNBLElBQUlBLFFBQVFBLEdBQUdBLHFCQUFhQSxDQUFDQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDdkNBLEVBQUVBLENBQUNBLENBQUNBLE9BQU9BLFFBQVFBLEtBQUtBLFFBQVFBLENBQUNBO3dCQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtvQkFDeERBLElBQUlBLENBQUNBLENBQUNBO3dCQUNKQSxxQkFBYUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBQUEsUUFBUUEsSUFBSUEsT0FBQUEsS0FBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsRUFBckJBLENBQXFCQSxDQUFDQSxDQUFDQTtvQkFDbkVBLENBQUNBO2dCQUNIQSxDQUFDQTtnQkFFREQscUJBQU1BLEdBQU5BLFVBQU9BLFFBQWdCQTtvQkFDckJFLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFdBQVdBLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFVBQVVBLENBQUNBLENBQUNBO29CQUNwQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsVUFBV0EsQ0FBQ0EsU0FBU0EsR0FBR0EsUUFBUUEsQ0FBQ0E7Z0JBQzlEQSxDQUFDQTtnQkE1QkhGO29CQUFDQSxhQUFLQSxDQUFDQTt3QkFDTEEsYUFBYUEsRUFBRUEsVUFBVUE7cUJBQzFCQSxDQUFDQTt5QkEyQkRBO2dCQUFEQSxXQUFDQTtZQUFEQSxDQTdCQSxBQTZCQ0EsSUFBQSIsImZpbGUiOiJhdHRyaWJ1dGVzL3N2Zy1pY29uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtEcmFmdCwgdGVtcGxhdGVDYWNoZX0gZnJvbSAnYXRyaWwnO1xuXG4vKipcbiAqIFNWRyBpY29uIGhlbHBlciB3aXRoIG9wdGlvbmFsIGFzeW5jIGxvYWRpbmcuXG4gKi9cbkBEcmFmdCh7XG4gIGF0dHJpYnV0ZU5hbWU6ICdzdmctaWNvbidcbn0pXG5jbGFzcyBDdHJsIHtcbiAgLy8gQXV0b2Fzc2lnbmVkXG4gIGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICBoaW50OiBzdHJpbmc7XG5cbiAgLy8gQ3VzdG9tXG4gIGF0dHJOYW1lOiBzdHJpbmc7XG4gIGNvbnRlbnQ6IERvY3VtZW50RnJhZ21lbnQ7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hdHRyTmFtZSA9ICdzdmctaWNvbi4nICsgdGhpcy5oaW50O1xuICAgIHRoaXMuY29udGVudCA9IDxEb2N1bWVudEZyYWdtZW50Pig8YW55PnRoaXMuZWxlbWVudCkuY29udGVudDtcbiAgICBsZXQgaWNvbk5hbWUgPSB0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKHRoaXMuYXR0ck5hbWUpO1xuICAgIGxldCBwYXRoID0gJ2FwcC9zdmcvJyArIGljb25OYW1lICsgJy5zdmcnO1xuXG4gICAgbGV0IHRlbXBsYXRlID0gdGVtcGxhdGVDYWNoZS5nZXQocGF0aCk7XG4gICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZSA9PT0gJ3N0cmluZycpIHRoaXMuY29tbWl0KHRlbXBsYXRlKTtcbiAgICBlbHNlIHtcbiAgICAgIHRlbXBsYXRlQ2FjaGUubG9hZChwYXRoKS50aGVuKHRlbXBsYXRlID0+IHRoaXMuY29tbWl0KHRlbXBsYXRlKSk7XG4gICAgfVxuICB9XG5cbiAgY29tbWl0KHRlbXBsYXRlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5jb250ZW50LmZpcnN0Q2hpbGQpO1xuICAgICg8SFRNTEVsZW1lbnQ+dGhpcy5lbGVtZW50LmZpcnN0Q2hpbGQpLmlubmVySFRNTCA9IHRlbXBsYXRlO1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=