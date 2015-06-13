System.register(['marked', 'highlightjs'], function(exports_1) {
    var marked_1, highlightjs_1;
    return {
        setters:[
            function (_marked_1) {
                marked_1 = _marked_1;
            },
            function (_highlightjs_1) {
                highlightjs_1 = _highlightjs_1;
            }],
        execute: function() {
            marked_1.default.setOptions({
                gfm: true,
                tables: true,
                breaks: false,
                sanitize: false,
                smartypants: false,
                pedantic: false,
                highlight: function (code, lang) {
                    var result;
                    // highlight.js throws an error when highlighting an unknown lang.
                    if (lang) {
                        try {
                            result = highlightjs_1.default.highlight(lang, code);
                        }
                        catch (err) {
                            result = highlightjs_1.default.highlightAuto(code);
                        }
                    }
                    else {
                        result = highlightjs_1.default.highlightAuto(code);
                    }
                    // Neuter interpolations. This is necessary to prevent atril from
                    // evaluating them in code blocks.
                    result.value = result.value.replace(/\{\{((?:[^}]|}(?=[^}]))*)\}\}/g, '{{<span>$1</span>}}');
                    return result.value;
                }
            });
        }
    }
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztZQUdBLGdCQUFNLENBQUMsVUFBVSxDQUFDO2dCQUNoQixHQUFHLEVBQVUsSUFBSTtnQkFDakIsTUFBTSxFQUFPLElBQUk7Z0JBQ2pCLE1BQU0sRUFBTyxLQUFLO2dCQUNsQixRQUFRLEVBQUssS0FBSztnQkFDbEIsV0FBVyxFQUFFLEtBQUs7Z0JBQ2xCLFFBQVEsRUFBSyxLQUFLO2dCQUNsQixTQUFTLEVBQUUsVUFBQyxJQUFJLEVBQUUsSUFBSTtvQkFDcEIsSUFBSSxNQUFxRCxDQUFDO29CQUMxRCxBQUNBLGtFQURrRTtvQkFDbEUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDVCxJQUFJLENBQUM7NEJBQ0gsTUFBTSxHQUFHLHFCQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFDckMsQ0FBRTt3QkFBQSxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOzRCQUNiLE1BQU0sR0FBRyxxQkFBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDbkMsQ0FBQztvQkFDSCxDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNOLE1BQU0sR0FBRyxxQkFBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDbkMsQ0FBQztvQkFDRCxBQUVBLGlFQUZpRTtvQkFDakUsa0NBQWtDO29CQUNsQyxNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGdDQUFnQyxFQUFFLHFCQUFxQixDQUFDLENBQUM7b0JBQzdGLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO2dCQUN0QixDQUFDO2FBQ0YsQ0FBQyxDQUFDIiwiZmlsZSI6ImNvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtYXJrZWQgZnJvbSAnbWFya2VkJztcbmltcG9ydCBoanMgZnJvbSAnaGlnaGxpZ2h0anMnO1xuXG5tYXJrZWQuc2V0T3B0aW9ucyh7XG4gIGdmbTogICAgICAgICB0cnVlLFxuICB0YWJsZXM6ICAgICAgdHJ1ZSxcbiAgYnJlYWtzOiAgICAgIGZhbHNlLFxuICBzYW5pdGl6ZTogICAgZmFsc2UsXG4gIHNtYXJ0eXBhbnRzOiBmYWxzZSxcbiAgcGVkYW50aWM6ICAgIGZhbHNlLFxuICBoaWdobGlnaHQ6IChjb2RlLCBsYW5nKSA9PiB7XG4gICAgbGV0IHJlc3VsdDogaGpzLklIaWdobGlnaHRSZXN1bHR8aGpzLklBdXRvSGlnaGxpZ2h0UmVzdWx0O1xuICAgIC8vIGhpZ2hsaWdodC5qcyB0aHJvd3MgYW4gZXJyb3Igd2hlbiBoaWdobGlnaHRpbmcgYW4gdW5rbm93biBsYW5nLlxuICAgIGlmIChsYW5nKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXN1bHQgPSBoanMuaGlnaGxpZ2h0KGxhbmcsIGNvZGUpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHJlc3VsdCA9IGhqcy5oaWdobGlnaHRBdXRvKGNvZGUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgPSBoanMuaGlnaGxpZ2h0QXV0byhjb2RlKTtcbiAgICB9XG4gICAgLy8gTmV1dGVyIGludGVycG9sYXRpb25zLiBUaGlzIGlzIG5lY2Vzc2FyeSB0byBwcmV2ZW50IGF0cmlsIGZyb21cbiAgICAvLyBldmFsdWF0aW5nIHRoZW0gaW4gY29kZSBibG9ja3MuXG4gICAgcmVzdWx0LnZhbHVlID0gcmVzdWx0LnZhbHVlLnJlcGxhY2UoL1xce1xceygoPzpbXn1dfH0oPz1bXn1dKSkqKVxcfVxcfS9nLCAne3s8c3Bhbj4kMTwvc3Bhbj59fScpO1xuICAgIHJldHVybiByZXN1bHQudmFsdWU7XG4gIH1cbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9