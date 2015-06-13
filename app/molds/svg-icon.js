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
                    this.content = this.element.content;
                    var path = 'app/svg/' + this.attribute.value + '.svg';
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
                __decorate([
                    atril_1.assign
                ], Ctrl.prototype, "attribute");
                __decorate([
                    atril_1.assign
                ], Ctrl.prototype, "hint");
                __decorate([
                    atril_1.assign
                ], Ctrl.prototype, "element");
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vbGRzL3N2Zy1pY29uLnRzIl0sIm5hbWVzIjpbIkN0cmwiLCJDdHJsLmNvbnN0cnVjdG9yIiwiQ3RybC5jb21taXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7WUFFQSxBQUdBOztlQURHOztnQkFXREE7b0JBVkZDLGlCQTJCQ0E7b0JBaEJHQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQTtvQkFDcENBLElBQUlBLElBQUlBLEdBQUdBLFVBQVVBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLEtBQUtBLEdBQUdBLE1BQU1BLENBQUNBO29CQUV0REEsSUFBSUEsSUFBSUEsR0FBR0EsaUJBQVNBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO29CQUMvQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsSUFBSUEsS0FBS0EsUUFBUUEsQ0FBQ0E7d0JBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLENBQUNBO29CQUNoREEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7d0JBQ0pBLGlCQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFBQSxJQUFJQSxJQUFJQSxPQUFBQSxLQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFqQkEsQ0FBaUJBLENBQUNBLENBQUNBO29CQUN2REEsQ0FBQ0E7Z0JBQ0hBLENBQUNBO2dCQUVERCxxQkFBTUEsR0FBTkEsVUFBT0EsSUFBWUE7b0JBQ2pCRSxJQUFJQSxLQUFLQSxHQUFnQkEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsVUFBVUEsQ0FBQ0E7b0JBQ2pEQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxXQUFXQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxXQUFXQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDMURBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLE9BQU9BLEtBQUtBLFNBQVNBLENBQUNBO3dCQUFDQSxLQUFLQSxDQUFDQSxTQUFTQSxDQUFDQSxHQUFHQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQTtvQkFDaEVBLEtBQUtBLENBQUNBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBO2dCQUN6QkEsQ0FBQ0E7Z0JBdEJERjtvQkFBQ0EsY0FBTUE7bUJBQUNBLDJCQUFTQSxFQUFPQTtnQkFDeEJBO29CQUFDQSxjQUFNQTttQkFBQ0Esc0JBQUlBLEVBQVNBO2dCQUNyQkE7b0JBQUNBLGNBQU1BO21CQUFDQSx5QkFBT0EsRUFBc0JBO2dCQU52Q0E7b0JBQUNBLFlBQUlBLENBQUNBO3dCQUNKQSxhQUFhQSxFQUFFQSxVQUFVQTtxQkFDMUJBLENBQUNBO3lCQXlCREE7Z0JBQURBLFdBQUNBO1lBQURBLENBM0JBLEFBMkJDQSxJQUFBIiwiZmlsZSI6Im1vbGRzL3N2Zy1pY29uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtNb2xkLCBhc3NpZ24sIHZpZXdDYWNoZX0gZnJvbSAnYXRyaWwnO1xuXG4vKipcbiAqIFNWRyBpY29uIGhlbHBlciB3aXRoIG9wdGlvbmFsIGFzeW5jIGxvYWRpbmcuXG4gKi9cbkBNb2xkKHtcbiAgYXR0cmlidXRlTmFtZTogJ3N2Zy1pY29uJ1xufSlcbmNsYXNzIEN0cmwge1xuICBAYXNzaWduIGF0dHJpYnV0ZTogQXR0cjtcbiAgQGFzc2lnbiBoaW50OiBzdHJpbmc7XG4gIEBhc3NpZ24gZWxlbWVudDogSFRNTFRlbXBsYXRlRWxlbWVudDtcblxuICBjb250ZW50OiBEb2N1bWVudEZyYWdtZW50O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY29udGVudCA9IHRoaXMuZWxlbWVudC5jb250ZW50O1xuICAgIGxldCBwYXRoID0gJ2FwcC9zdmcvJyArIHRoaXMuYXR0cmlidXRlLnZhbHVlICsgJy5zdmcnO1xuXG4gICAgbGV0IHZpZXcgPSB2aWV3Q2FjaGUuZ2V0KHBhdGgpO1xuICAgIGlmICh0eXBlb2YgdmlldyA9PT0gJ3N0cmluZycpIHRoaXMuY29tbWl0KHZpZXcpO1xuICAgIGVsc2Uge1xuICAgICAgdmlld0NhY2hlLmxvYWQocGF0aCkudGhlbih2aWV3ID0+IHRoaXMuY29tbWl0KHZpZXcpKTtcbiAgICB9XG4gIH1cblxuICBjb21taXQodmlldzogc3RyaW5nKTogdm9pZCB7XG4gICAgbGV0IGNoaWxkID0gPEhUTUxFbGVtZW50PnRoaXMuY29udGVudC5maXJzdENoaWxkO1xuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRlbnQucmVtb3ZlQ2hpbGQoY2hpbGQpKTtcbiAgICBpZiAoY2hpbGQudGFnTmFtZSAhPT0gJ3NmLWljb24nKSBjaGlsZC5jbGFzc0xpc3QuYWRkKCdzZi1pY29uJyk7XG4gICAgY2hpbGQuaW5uZXJIVE1MID0gdmlldztcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9