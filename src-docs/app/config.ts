import marked from 'marked';
import hjs from 'highlightjs';

marked.setOptions({
  gfm:         true,
  tables:      true,
  breaks:      false,
  sanitize:    false,
  smartypants: false,
  pedantic:    false,
  highlight: (code, lang) => {
    let result: hjs.IHighlightResult|hjs.IAutoHighlightResult;
    // highlight.js throws an error when highlighting an unknown lang.
    if (lang) {
      try {
        result = hjs.highlight(lang, code);
      } catch (err) {
        result = hjs.highlightAuto(code);
      }
    } else {
      result = hjs.highlightAuto(code);
    }
    // Neuter interpolations. This is necessary to prevent atril from
    // evaluating them in code blocks.
    result.value = result.value.replace(/\{\{((?:[^}]|}(?=[^}]))*)\}\}/g, '{{<span>$1</span>}}');
    return result.value;
  }
});
