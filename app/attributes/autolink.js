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
            Ctrl = (function () {
                function Ctrl() {
                    if (!(this.element instanceof HTMLAnchorElement))
                        return;
                    this.element.id = this.attribute.value;
                    var base = document.head.querySelector('base').getAttribute('href');
                    var prefix = location.pathname.replace(base, '');
                    this.element.href = prefix + '#' + this.attribute.value;
                }
                __decorate([
                    atril_1.assign
                ], Ctrl.prototype, "element");
                __decorate([
                    atril_1.assign
                ], Ctrl.prototype, "attribute");
                Ctrl = __decorate([
                    atril_1.Attribute({ attributeName: 'autolink' })
                ], Ctrl);
                return Ctrl;
            })();
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF0dHJpYnV0ZXMvYXV0b2xpbmsudHMiXSwibmFtZXMiOlsiQ3RybCIsIkN0cmwuY29uc3RydWN0b3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7WUFFQTtnQkFLRUE7b0JBQ0VDLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLFlBQVlBLGlCQUFpQkEsQ0FBQ0EsQ0FBQ0E7d0JBQUNBLE1BQU1BLENBQUNBO29CQUV6REEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsQ0FBQ0E7b0JBRXZDQSxJQUFJQSxJQUFJQSxHQUFHQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxZQUFZQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtvQkFDcEVBLElBQUlBLE1BQU1BLEdBQUdBLFFBQVFBLENBQUNBLFFBQVFBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO29CQUNqREEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsR0FBR0EsTUFBTUEsR0FBR0EsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsQ0FBQ0E7Z0JBQzFEQSxDQUFDQTtnQkFYREQ7b0JBQUNBLGNBQU1BO21CQUFDQSx5QkFBT0EsRUFBb0JBO2dCQUNuQ0E7b0JBQUNBLGNBQU1BO21CQUFDQSwyQkFBU0EsRUFBT0E7Z0JBSDFCQTtvQkFBQ0EsaUJBQVNBLENBQUNBLEVBQUNBLGFBQWFBLEVBQUVBLFVBQVVBLEVBQUNBLENBQUNBO3lCQWN0Q0E7Z0JBQURBLFdBQUNBO1lBQURBLENBZEEsQUFjQ0EsSUFBQSIsImZpbGUiOiJhdHRyaWJ1dGVzL2F1dG9saW5rLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBdHRyaWJ1dGUsIGFzc2lnbn0gZnJvbSAnYXRyaWwnO1xuXG5AQXR0cmlidXRlKHthdHRyaWJ1dGVOYW1lOiAnYXV0b2xpbmsnfSlcbmNsYXNzIEN0cmwge1xuICBAYXNzaWduIGVsZW1lbnQ6IEhUTUxBbmNob3JFbGVtZW50O1xuICBAYXNzaWduIGF0dHJpYnV0ZTogQXR0cjtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBpZiAoISh0aGlzLmVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MQW5jaG9yRWxlbWVudCkpIHJldHVybjtcblxuICAgIHRoaXMuZWxlbWVudC5pZCA9IHRoaXMuYXR0cmlidXRlLnZhbHVlO1xuXG4gICAgbGV0IGJhc2UgPSBkb2N1bWVudC5oZWFkLnF1ZXJ5U2VsZWN0b3IoJ2Jhc2UnKS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcbiAgICBsZXQgcHJlZml4ID0gbG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZShiYXNlLCAnJyk7XG4gICAgdGhpcy5lbGVtZW50LmhyZWYgPSBwcmVmaXggKyAnIycgKyB0aGlzLmF0dHJpYnV0ZS52YWx1ZTtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9