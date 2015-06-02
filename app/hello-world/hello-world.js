var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};System.register(['atril'], function(exports_1) {
    var atril_1;
    var ViewModel;
    return {
        setters:[
            function (_atril_1) {
                atril_1 = _atril_1;
            }],
        execute: function() {
            ViewModel = (function () {
                function ViewModel() {
                    this.name = 'world';
                }
                ViewModel.viewUrl = 'app/hello-world/hello-world.html';
                ViewModel = __decorate([
                    atril_1.Component({
                        tagName: 'hello-world'
                    })
                ], ViewModel);
                return ViewModel;
            })();
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhlbGxvLXdvcmxkL2hlbGxvLXdvcmxkLnRzIl0sIm5hbWVzIjpbIlZpZXdNb2RlbCIsIlZpZXdNb2RlbC5jb25zdHJ1Y3RvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztZQUVBO2dCQUFBQTtvQkFJRUMsU0FBSUEsR0FBR0EsT0FBT0EsQ0FBQ0E7Z0JBRWpCQSxDQUFDQTtnQkFEUUQsaUJBQU9BLEdBQUdBLGtDQUFrQ0EsQ0FBQ0E7Z0JBTHREQTtvQkFBQ0EsaUJBQVNBLENBQUNBO3dCQUNUQSxPQUFPQSxFQUFFQSxhQUFhQTtxQkFDdkJBLENBQUNBOzhCQUlEQTtnQkFBREEsZ0JBQUNBO1lBQURBLENBTkEsQUFNQ0EsSUFBQSIsImZpbGUiOiJoZWxsby13b3JsZC9oZWxsby13b3JsZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50fSBmcm9tICdhdHJpbCc7XG5cbkBDb21wb25lbnQoe1xuICB0YWdOYW1lOiAnaGVsbG8td29ybGQnXG59KVxuY2xhc3MgVmlld01vZGVsIHtcbiAgbmFtZSA9ICd3b3JsZCc7XG4gIHN0YXRpYyB2aWV3VXJsID0gJ2FwcC9oZWxsby13b3JsZC9oZWxsby13b3JsZC5odG1sJztcbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==