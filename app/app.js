System.register(['atril', 'views', 'config', 'attributes/all', 'molds/all', 'hello-world/hello-world', 'todo-item/todo-item', 'todo-list/todo-list'], function(exports_1) {
    var atril_1, views_1;
    return {
        setters:[
            function (_atril_1) {
                atril_1 = _atril_1;
            },
            function (_views_1) {
                views_1 = _views_1;
            },
            function (_) {},
            function (_) {},
            function (_) {},
            function (_) {},
            function (_) {},
            function (_) {}],
        execute: function() {
            for (var path in views_1.default)
                atril_1.viewCache.set(path, views_1.default[path]);
            atril_1.bootstrap();
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztZQUdBLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksZUFBSyxDQUFDO2dCQUFDLGlCQUFTLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxlQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQVd6RCxpQkFBUyxFQUFFLENBQUMiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtib290c3RyYXAsIHZpZXdDYWNoZX0gZnJvbSAnYXRyaWwnO1xuXG5pbXBvcnQgdmlld3MgZnJvbSAndmlld3MnO1xuZm9yIChsZXQgcGF0aCBpbiB2aWV3cykgdmlld0NhY2hlLnNldChwYXRoLCB2aWV3c1twYXRoXSk7XG5cbmltcG9ydCAnY29uZmlnJztcbmltcG9ydCAnYXR0cmlidXRlcy9hbGwnO1xuaW1wb3J0ICdtb2xkcy9hbGwnO1xuaW1wb3J0ICdoZWxsby13b3JsZC9oZWxsby13b3JsZCc7XG4vLyBpbXBvcnQgJ2lubmVyLWNvbXBvbmVudC9pbm5lci1jb21wb25lbnQnO1xuLy8gaW1wb3J0ICdtb2NrLWNvbXBvbmVudC9tb2NrLWNvbXBvbmVudCc7XG5pbXBvcnQgJ3RvZG8taXRlbS90b2RvLWl0ZW0nO1xuaW1wb3J0ICd0b2RvLWxpc3QvdG9kby1saXN0JztcblxuYm9vdHN0cmFwKCk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=