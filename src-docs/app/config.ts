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

/**
 * marked rendering enhancements.
 */

// Default link renderer func.
let renderLink = marked.Renderer.prototype.link;

// Custom link renderer func that adds target="_blank" to links to other sites.
// Mostly copied from the marked source.
marked.Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    let prot = '';
    try {
      prot = decodeURIComponent(href)
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
      return '';
    }
  }
  let out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  if (/^[a-z]+:\/\//.test(href)) {
    out += ' target="_blank"';
  }
  out += '>' + text + '</a>';
  return out;
}
