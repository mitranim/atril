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
                    atril_1.Mold({
                        attributeName: 'svg-icon'
                    })
                ], Ctrl);
                return Ctrl;
            })();
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF0dHJpYnV0ZXMvc3ZnLWljb24udHMiXSwibmFtZXMiOlsiQ3RybCIsIkN0cmwuY29uc3RydWN0b3IiLCJDdHJsLmNvbW1pdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztZQUVBLEFBR0E7O2VBREc7O2dCQWFEQTtvQkFaRkMsaUJBNkJDQTtvQkFoQkdBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLFdBQVdBLEdBQUdBLElBQUlBLENBQUNBLElBQUlBLENBQUNBO29CQUN4Q0EsSUFBSUEsQ0FBQ0EsT0FBT0EsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0E7b0JBQ3BDQSxJQUFJQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtvQkFDeERBLElBQUlBLElBQUlBLEdBQUdBLFVBQVVBLEdBQUdBLFFBQVFBLEdBQUdBLE1BQU1BLENBQUNBO29CQUUxQ0EsSUFBSUEsUUFBUUEsR0FBR0EscUJBQWFBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO29CQUN2Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsUUFBUUEsS0FBS0EsUUFBUUEsQ0FBQ0E7d0JBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO29CQUN4REEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7d0JBQ0pBLHFCQUFhQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFBQSxRQUFRQSxJQUFJQSxPQUFBQSxLQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxRQUFRQSxDQUFDQSxFQUFyQkEsQ0FBcUJBLENBQUNBLENBQUNBO29CQUNuRUEsQ0FBQ0E7Z0JBQ0hBLENBQUNBO2dCQUVERCxxQkFBTUEsR0FBTkEsVUFBT0EsUUFBZ0JBO29CQUNyQkUsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7b0JBQ3BDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxVQUFXQSxDQUFDQSxTQUFTQSxHQUFHQSxRQUFRQSxDQUFDQTtnQkFDOURBLENBQUNBO2dCQTVCSEY7b0JBQUNBLFlBQUlBLENBQUNBO3dCQUNKQSxhQUFhQSxFQUFFQSxVQUFVQTtxQkFDMUJBLENBQUNBO3lCQTJCREE7Z0JBQURBLFdBQUNBO1lBQURBLENBN0JBLEFBNkJDQSxJQUFBIiwiZmlsZSI6ImF0dHJpYnV0ZXMvc3ZnLWljb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge01vbGQsIHRlbXBsYXRlQ2FjaGV9IGZyb20gJ2F0cmlsJztcblxuLyoqXG4gKiBTVkcgaWNvbiBoZWxwZXIgd2l0aCBvcHRpb25hbCBhc3luYyBsb2FkaW5nLlxuICovXG5ATW9sZCh7XG4gIGF0dHJpYnV0ZU5hbWU6ICdzdmctaWNvbidcbn0pXG5jbGFzcyBDdHJsIHtcbiAgLy8gQXV0b2Fzc2lnbmVkXG4gIGVsZW1lbnQ6IEhUTUxUZW1wbGF0ZUVsZW1lbnQ7XG4gIGhpbnQ6IHN0cmluZztcblxuICAvLyBDdXN0b21cbiAgYXR0ck5hbWU6IHN0cmluZztcbiAgY29udGVudDogRG9jdW1lbnRGcmFnbWVudDtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmF0dHJOYW1lID0gJ3N2Zy1pY29uLicgKyB0aGlzLmhpbnQ7XG4gICAgdGhpcy5jb250ZW50ID0gdGhpcy5lbGVtZW50LmNvbnRlbnQ7XG4gICAgbGV0IGljb25OYW1lID0gdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSh0aGlzLmF0dHJOYW1lKTtcbiAgICBsZXQgcGF0aCA9ICdhcHAvc3ZnLycgKyBpY29uTmFtZSArICcuc3ZnJztcblxuICAgIGxldCB0ZW1wbGF0ZSA9IHRlbXBsYXRlQ2FjaGUuZ2V0KHBhdGgpO1xuICAgIGlmICh0eXBlb2YgdGVtcGxhdGUgPT09ICdzdHJpbmcnKSB0aGlzLmNvbW1pdCh0ZW1wbGF0ZSk7XG4gICAgZWxzZSB7XG4gICAgICB0ZW1wbGF0ZUNhY2hlLmxvYWQocGF0aCkudGhlbih0ZW1wbGF0ZSA9PiB0aGlzLmNvbW1pdCh0ZW1wbGF0ZSkpO1xuICAgIH1cbiAgfVxuXG4gIGNvbW1pdCh0ZW1wbGF0ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuY29udGVudC5maXJzdENoaWxkKTtcbiAgICAoPEhUTUxFbGVtZW50PnRoaXMuZWxlbWVudC5maXJzdENoaWxkKS5pbm5lckhUTUwgPSB0ZW1wbGF0ZTtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9