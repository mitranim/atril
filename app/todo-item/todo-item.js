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
                    this.item = null;
                    this.isNew = false;
                }
                VM.prototype.add = function () {
                    this.element.dispatchEvent(new CustomEvent('add'));
                };
                VM.prototype.remove = function () {
                    this.element.dispatchEvent(new CustomEvent('remove'));
                };
                VM.viewUrl = 'app/todo-item/todo-item.html';
                __decorate([
                    atril_1.bindable
                ], VM.prototype, "item");
                __decorate([
                    atril_1.bindable
                ], VM.prototype, "isNew");
                VM = __decorate([
                    atril_1.Component({
                        tagName: 'todo-item'
                    })
                ], VM);
                return VM;
            })();
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvZG8taXRlbS90b2RvLWl0ZW0udHMiXSwibmFtZXMiOlsiVk0iLCJWTS5jb25zdHJ1Y3RvciIsIlZNLmFkZCIsIlZNLnJlbW92ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztZQUVBO2dCQUFBQTtvQkFJWUMsU0FBSUEsR0FBR0EsSUFBSUEsQ0FBQ0E7b0JBQ1pBLFVBQUtBLEdBQUdBLEtBQUtBLENBQUNBO2dCQWExQkEsQ0FBQ0E7Z0JBVENELGdCQUFHQSxHQUFIQTtvQkFDRUUsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsYUFBYUEsQ0FBQ0EsSUFBSUEsV0FBV0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3JEQSxDQUFDQTtnQkFFREYsbUJBQU1BLEdBQU5BO29CQUNFRyxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxhQUFhQSxDQUFDQSxJQUFJQSxXQUFXQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDeERBLENBQUNBO2dCQUVNSCxVQUFPQSxHQUFHQSw4QkFBOEJBLENBQUNBO2dCQWJoREE7b0JBQUNBLGdCQUFRQTttQkFBQ0Esb0JBQUlBLEVBQVFBO2dCQUN0QkE7b0JBQUNBLGdCQUFRQTttQkFBQ0EscUJBQUtBLEVBQVNBO2dCQUwxQkE7b0JBQUNBLGlCQUFTQSxDQUFDQTt3QkFDVEEsT0FBT0EsRUFBRUEsV0FBV0E7cUJBQ3JCQSxDQUFDQTt1QkFnQkRBO2dCQUFEQSxTQUFDQTtZQUFEQSxDQWxCQSxBQWtCQ0EsSUFBQSIsImZpbGUiOiJ0b2RvLWl0ZW0vdG9kby1pdGVtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIGJpbmRhYmxlfSBmcm9tICdhdHJpbCc7XG5cbkBDb21wb25lbnQoe1xuICB0YWdOYW1lOiAndG9kby1pdGVtJ1xufSlcbmNsYXNzIFZNIHtcbiAgQGJpbmRhYmxlIGl0ZW0gPSBudWxsO1xuICBAYmluZGFibGUgaXNOZXcgPSBmYWxzZTtcblxuICBlbGVtZW50OiBIVE1MRWxlbWVudDtcblxuICBhZGQoKSB7XG4gICAgdGhpcy5lbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdhZGQnKSk7XG4gIH1cblxuICByZW1vdmUoKSB7XG4gICAgdGhpcy5lbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdyZW1vdmUnKSk7XG4gIH1cblxuICBzdGF0aWMgdmlld1VybCA9ICdhcHAvdG9kby1pdGVtL3RvZG8taXRlbS5odG1sJztcbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==