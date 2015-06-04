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
                    this.text = '';
                    this.items = [
                        { text: 'Learn a new framework', completed: true },
                        { text: 'Be awesome' }
                    ];
                    this.newItem = { text: '', completed: false };
                }
                VM.prototype.add = function () {
                    this.items.unshift(this.newItem);
                    this.newItem = { text: '', completed: false };
                };
                VM.prototype.remove = function (item) {
                    this.items.splice(this.items.indexOf(item), 1);
                };
                VM.viewUrl = 'app/todo-list/todo-list.html';
                VM = __decorate([
                    atril_1.Component({
                        tagName: 'todo-list'
                    })
                ], VM);
                return VM;
            })();
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvZG8tbGlzdC90b2RvLWxpc3QudHMiXSwibmFtZXMiOlsiVk0iLCJWTS5jb25zdHJ1Y3RvciIsIlZNLmFkZCIsIlZNLnJlbW92ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztZQUVBO2dCQUFBQTtvQkFJRUMsU0FBSUEsR0FBR0EsRUFBRUEsQ0FBQ0E7b0JBQ1ZBLFVBQUtBLEdBQUdBO3dCQUNOQSxFQUFDQSxJQUFJQSxFQUFFQSx1QkFBdUJBLEVBQUVBLFNBQVNBLEVBQUVBLElBQUlBLEVBQUNBO3dCQUNoREEsRUFBQ0EsSUFBSUEsRUFBRUEsWUFBWUEsRUFBQ0E7cUJBQ3JCQSxDQUFDQTtvQkFDRkEsWUFBT0EsR0FBR0EsRUFBQ0EsSUFBSUEsRUFBRUEsRUFBRUEsRUFBRUEsU0FBU0EsRUFBRUEsS0FBS0EsRUFBQ0EsQ0FBQ0E7Z0JBWXpDQSxDQUFDQTtnQkFWQ0QsZ0JBQUdBLEdBQUhBO29CQUNFRSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtvQkFDakNBLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLEVBQUNBLElBQUlBLEVBQUVBLEVBQUVBLEVBQUVBLFNBQVNBLEVBQUVBLEtBQUtBLEVBQUNBLENBQUNBO2dCQUM5Q0EsQ0FBQ0E7Z0JBRURGLG1CQUFNQSxHQUFOQSxVQUFPQSxJQUFJQTtvQkFDVEcsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2pEQSxDQUFDQTtnQkFFTUgsVUFBT0EsR0FBR0EsOEJBQThCQSxDQUFDQTtnQkFwQmxEQTtvQkFBQ0EsaUJBQVNBLENBQUNBO3dCQUNUQSxPQUFPQSxFQUFFQSxXQUFXQTtxQkFDckJBLENBQUNBO3VCQW1CREE7Z0JBQURBLFNBQUNBO1lBQURBLENBckJBLEFBcUJDQSxJQUFBIiwiZmlsZSI6InRvZG8tbGlzdC90b2RvLWxpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudH0gZnJvbSAnYXRyaWwnO1xuXG5AQ29tcG9uZW50KHtcbiAgdGFnTmFtZTogJ3RvZG8tbGlzdCdcbn0pXG5jbGFzcyBWTSB7XG4gIHRleHQgPSAnJztcbiAgaXRlbXMgPSBbXG4gICAge3RleHQ6ICdMZWFybiBhIG5ldyBmcmFtZXdvcmsnLCBjb21wbGV0ZWQ6IHRydWV9LFxuICAgIHt0ZXh0OiAnQmUgYXdlc29tZSd9XG4gIF07XG4gIG5ld0l0ZW0gPSB7dGV4dDogJycsIGNvbXBsZXRlZDogZmFsc2V9O1xuXG4gIGFkZCgpIHtcbiAgICB0aGlzLml0ZW1zLnVuc2hpZnQodGhpcy5uZXdJdGVtKTtcbiAgICB0aGlzLm5ld0l0ZW0gPSB7dGV4dDogJycsIGNvbXBsZXRlZDogZmFsc2V9O1xuICB9XG5cbiAgcmVtb3ZlKGl0ZW0pIHtcbiAgICB0aGlzLml0ZW1zLnNwbGljZSh0aGlzLml0ZW1zLmluZGV4T2YoaXRlbSksIDEpO1xuICB9XG5cbiAgc3RhdGljIHZpZXdVcmwgPSAnYXBwL3RvZG8tbGlzdC90b2RvLWxpc3QuaHRtbCc7XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=