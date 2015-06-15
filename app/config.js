System.register(['marked', 'highlightjs'], function(exports_1) {
    var marked_1, highlightjs_1;
    var renderLink;
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
            /**
             * marked rendering enhancements.
             */
            // Default link renderer func.
            renderLink = marked_1.default.Renderer.prototype.link;
            // Custom link renderer func that adds target="_blank" to links to other sites.
            // Mostly copied from the marked source.
            marked_1.default.Renderer.prototype.link = function (href, title, text) {
                if (this.options.sanitize) {
                    var prot = '';
                    try {
                        prot = decodeURIComponent(href)
                            .replace(/[^\w:]/g, '')
                            .toLowerCase();
                    }
                    catch (e) {
                        return '';
                    }
                    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
                        return '';
                    }
                }
                var out = '<a href="' + href + '"';
                if (title) {
                    out += ' title="' + title + '"';
                }
                if (/^[a-z]+:\/\//.test(href)) {
                    out += ' target="_blank"';
                }
                out += '>' + text + '</a>';
                return out;
            };
        }
    }
});

//# sourceMappingURL=data:application/json;base64,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QkFDM0IsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUNiLENBQUMsQ0FBQSIsImZpbGUiOiJjb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbWFya2VkIGZyb20gJ21hcmtlZCc7XG5pbXBvcnQgaGpzIGZyb20gJ2hpZ2hsaWdodGpzJztcblxubWFya2VkLnNldE9wdGlvbnMoe1xuICBnZm06ICAgICAgICAgdHJ1ZSxcbiAgdGFibGVzOiAgICAgIHRydWUsXG4gIGJyZWFrczogICAgICBmYWxzZSxcbiAgc2FuaXRpemU6ICAgIGZhbHNlLFxuICBzbWFydHlwYW50czogZmFsc2UsXG4gIHBlZGFudGljOiAgICBmYWxzZSxcbiAgaGlnaGxpZ2h0OiAoY29kZSwgbGFuZykgPT4ge1xuICAgIGxldCByZXN1bHQ6IGhqcy5JSGlnaGxpZ2h0UmVzdWx0fGhqcy5JQXV0b0hpZ2hsaWdodFJlc3VsdDtcbiAgICAvLyBoaWdobGlnaHQuanMgdGhyb3dzIGFuIGVycm9yIHdoZW4gaGlnaGxpZ2h0aW5nIGFuIHVua25vd24gbGFuZy5cbiAgICBpZiAobGFuZykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gaGpzLmhpZ2hsaWdodChsYW5nLCBjb2RlKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICByZXN1bHQgPSBoanMuaGlnaGxpZ2h0QXV0byhjb2RlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0ID0gaGpzLmhpZ2hsaWdodEF1dG8oY29kZSk7XG4gICAgfVxuICAgIC8vIE5ldXRlciBpbnRlcnBvbGF0aW9ucy4gVGhpcyBpcyBuZWNlc3NhcnkgdG8gcHJldmVudCBhdHJpbCBmcm9tXG4gICAgLy8gZXZhbHVhdGluZyB0aGVtIGluIGNvZGUgYmxvY2tzLlxuICAgIHJlc3VsdC52YWx1ZSA9IHJlc3VsdC52YWx1ZS5yZXBsYWNlKC9cXHtcXHsoKD86W159XXx9KD89W159XSkpKilcXH1cXH0vZywgJ3t7PHNwYW4+JDE8L3NwYW4+fX0nKTtcbiAgICByZXR1cm4gcmVzdWx0LnZhbHVlO1xuICB9XG59KTtcblxuLyoqXG4gKiBtYXJrZWQgcmVuZGVyaW5nIGVuaGFuY2VtZW50cy5cbiAqL1xuXG4vLyBEZWZhdWx0IGxpbmsgcmVuZGVyZXIgZnVuYy5cbmxldCByZW5kZXJMaW5rID0gbWFya2VkLlJlbmRlcmVyLnByb3RvdHlwZS5saW5rO1xuXG4vLyBDdXN0b20gbGluayByZW5kZXJlciBmdW5jIHRoYXQgYWRkcyB0YXJnZXQ9XCJfYmxhbmtcIiB0byBsaW5rcyB0byBvdGhlciBzaXRlcy5cbi8vIE1vc3RseSBjb3BpZWQgZnJvbSB0aGUgbWFya2VkIHNvdXJjZS5cbm1hcmtlZC5SZW5kZXJlci5wcm90b3R5cGUubGluayA9IGZ1bmN0aW9uKGhyZWYsIHRpdGxlLCB0ZXh0KSB7XG4gIGlmICh0aGlzLm9wdGlvbnMuc2FuaXRpemUpIHtcbiAgICBsZXQgcHJvdCA9ICcnO1xuICAgIHRyeSB7XG4gICAgICBwcm90ID0gZGVjb2RlVVJJQ29tcG9uZW50KGhyZWYpXG4gICAgICAgIC5yZXBsYWNlKC9bXlxcdzpdL2csICcnKVxuICAgICAgICAudG9Mb3dlckNhc2UoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGlmIChwcm90LmluZGV4T2YoJ2phdmFzY3JpcHQ6JykgPT09IDAgfHwgcHJvdC5pbmRleE9mKCd2YnNjcmlwdDonKSA9PT0gMCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfVxuICBsZXQgb3V0ID0gJzxhIGhyZWY9XCInICsgaHJlZiArICdcIic7XG4gIGlmICh0aXRsZSkge1xuICAgIG91dCArPSAnIHRpdGxlPVwiJyArIHRpdGxlICsgJ1wiJztcbiAgfVxuICBpZiAoL15bYS16XSs6XFwvXFwvLy50ZXN0KGhyZWYpKSB7XG4gICAgb3V0ICs9ICcgdGFyZ2V0PVwiX2JsYW5rXCInO1xuICB9XG4gIG91dCArPSAnPicgKyB0ZXh0ICsgJzwvYT4nO1xuICByZXR1cm4gb3V0O1xufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9