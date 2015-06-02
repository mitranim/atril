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
                    this.val = null;
                    this.color = 'red';
                }
                VM.viewUrl = 'app/inner-component/inner-component.html';
                __decorate([
                    atril_1.bindable
                ], VM.prototype, "val");
                __decorate([
                    atril_1.bindable
                ], VM.prototype, "color");
                VM = __decorate([
                    atril_1.Component({ tagName: 'inner-component' })
                ], VM);
                return VM;
            })();
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImlubmVyLWNvbXBvbmVudC9pbm5lci1jb21wb25lbnQudHMiXSwibmFtZXMiOlsiVk0iLCJWTS5jb25zdHJ1Y3RvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztZQUVBO2dCQUFBQTtvQkFFWUMsUUFBR0EsR0FBR0EsSUFBSUEsQ0FBQ0E7b0JBQ1hBLFVBQUtBLEdBQUdBLEtBQUtBLENBQUNBO2dCQUcxQkEsQ0FBQ0E7Z0JBRFFELFVBQU9BLEdBQUdBLDBDQUEwQ0EsQ0FBQ0E7Z0JBSDVEQTtvQkFBQ0EsZ0JBQVFBO21CQUFDQSxtQkFBR0EsRUFBUUE7Z0JBQ3JCQTtvQkFBQ0EsZ0JBQVFBO21CQUFDQSxxQkFBS0EsRUFBU0E7Z0JBSDFCQTtvQkFBQ0EsaUJBQVNBLENBQUNBLEVBQUNBLE9BQU9BLEVBQUVBLGlCQUFpQkEsRUFBQ0EsQ0FBQ0E7dUJBTXZDQTtnQkFBREEsU0FBQ0E7WUFBREEsQ0FOQSxBQU1DQSxJQUFBIiwiZmlsZSI6ImlubmVyLWNvbXBvbmVudC9pbm5lci1jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgYmluZGFibGV9IGZyb20gJ2F0cmlsJztcblxuQENvbXBvbmVudCh7dGFnTmFtZTogJ2lubmVyLWNvbXBvbmVudCd9KVxuY2xhc3MgVk0ge1xuICBAYmluZGFibGUgdmFsID0gbnVsbDtcbiAgQGJpbmRhYmxlIGNvbG9yID0gJ3JlZCc7XG5cbiAgc3RhdGljIHZpZXdVcmwgPSAnYXBwL2lubmVyLWNvbXBvbmVudC9pbm5lci1jb21wb25lbnQuaHRtbCc7XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=