'use strict';

/**
 * Requires gulp 4.0:
 *   "gulp": "git://github.com/gulpjs/gulp#4.0"
 */

/******************************* Dependencies ********************************/

var $       = require('gulp-load-plugins')();
var bsync   = require('browser-sync').create();
var gulp    = require('gulp');
var hjs     = require('highlight.js');
var marked  = require('gulp-marked/node_modules/marked');
var flags   = require('yargs').argv;
var pt      = require('path');

/********************************** Globals **********************************/

var src = {
  lib:        'src/**/*.ts',
  stylesCore: 'src-docs/styles/app.less',
  styles:     'src-docs/styles/**/*.less',
  html:       'src-docs/html',
  scripts:    'src-docs/app/**/*.ts',
  views:      [
    'src-docs/app/**/*.html',
    'src-docs/app/**/*.svg'
  ],
  img:        'src-docs/img/**/*',
  system:     './system.config.js'
};

var dest = {
  lib:     'lib',
  docs:    'dist',
  styles:  'dist/css',
  img:     'dist/img',
  html:    'dist',
  scripts: [
    'dist/app/**/*.js',
    '!dist/app/views.js'
  ],
  views: 'dist/app/views.js',
  app: 'dist/app'
};

var jspmPath = dest.docs + '/jspm_packages';

function prod() {
  return flags.prod === true || flags.prod === 'true';
}

function reload(done) {
  bsync.reload();
  done();
}

/***************************** Template Imports ******************************/

/**
 * Utility methods for templates.
 */
var imports = {
  lastId: 0,
  uniqId: function() {return 'static-id-' + ++imports.lastId},
  lastUniqId: function() {return 'static-id-' + imports.lastId},
  prod: prod
}

/********************************** Config ***********************************/

/**
 * marked rendering enhancements.
 */

// Default link renderer func.
var renderLink = marked.Renderer.prototype.link

// Custom link renderer func that adds target="_blank" to links to other sites.
// Mostly copied from the marked source.
marked.Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase()
    } catch (e) {
      return ''
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
      return ''
    }
  }
  var out = '<a href="' + href + '"'
  if (title) {
    out += ' title="' + title + '"'
  }
  if (/^[a-z]+:\/\//.test(href)) {
    out += ' target="_blank"'
  }
  out += '>' + text + '</a>'
  return out
}

/*********************************** Tasks ***********************************/

/*------------------------------- Lib Scripts -------------------------------*/

gulp.task('lib:clear', function() {
  return gulp.src(dest.lib, {read: false, allowEmpty: true})
    .pipe($.plumber())
    .pipe($.rimraf());
});

gulp.task('lib:compile', function() {
  var filter = $.filter('index.js');

  return gulp.src(src.lib)
    .pipe($.plumber())
    .pipe($.typescript({
      typescript: require('typescript'),
      target: 'ES5',
      module: 'commonjs',
      noExternalResolve: true,
      experimentalDecorators: true
    }))
    .pipe(filter)
    // Allow SystemJS to consume our named exports the ES6 way.
    .pipe($.replace(/$/,
      "\nObject.defineProperty(exports, '__esModule', {\n" +
      "  value: true\n" +
      "});\n"
    ))
    .pipe(filter.restore())
    .pipe(gulp.dest(dest.lib));
});

gulp.task('lib:build', gulp.series('lib:clear', 'lib:compile'));

gulp.task('lib:watch', function() {
  $.watch(src.lib, gulp.series('lib:build', reload));
});

/*--------------------------------- Scripts ---------------------------------*/

gulp.task('docs:scripts:clear', function() {
  return gulp.src(dest.scripts, {read: false, allowEmpty: true})
    .pipe($.plumber())
    .pipe($.rimraf());
});

gulp.task('docs:scripts:compile', function() {
  return gulp.src(src.scripts)
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.typescript({
      noExternalResolve: true,
      typescript: require('typescript'),
      target: 'ES5',
      module: 'system',
      experimentalDecorators: true
    }))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(dest.app));
});

gulp.task('docs:scripts:build', gulp.series('docs:scripts:clear', 'docs:scripts:compile'));

gulp.task('docs:scripts:watch', function() {
  $.watch(src.scripts, gulp.series('docs:scripts:build', reload));
});

/*---------------------------------- Views ----------------------------------*/

gulp.task('docs:views:clear', function() {
  return gulp.src(dest.views, {read: false, allowEmpty: true})
    .pipe($.plumber())
    .pipe($.rimraf());
});

gulp.task('docs:views:html2js', function() {
  return gulp.src(src.views)
    .pipe($.atrilHtml2js({
      stripPrefix: 'src-docs',
      concat: 'views.js'
    }))
    .pipe(gulp.dest(dest.app));
});

// Copy for the purpose of demoing template retrieval by templateUrl. Normally
// you just use html2js instead.
gulp.task('docs:views:copy', function() {
  return gulp.src(src.views).pipe(gulp.dest(dest.app));
});

gulp.task('docs:views:build',
  gulp.series('docs:views:clear', gulp.parallel('docs:views:html2js', 'docs:views:copy')));

gulp.task('docs:views:watch', function() {
  $.watch(src.views, gulp.series('docs:views:build', reload));
});

/*---------------------------------- HTML -----------------------------------*/

gulp.task('docs:html:clear', function() {
  return gulp.src([
      dest.html + '/**/*.html',
      '!' + dest.app + '/**/*',
      '!' + jspmPath + '/**/*'
    ], {read: false, allowEmpty: true})
    .pipe($.plumber())
    .pipe($.rimraf());
});

gulp.task('docs:html:compile', function() {
  var filterMd = $.filter('**/*.md')

  return gulp.src(src.html + '/**/*')
    .pipe($.plumber())
    // Pre-process the markdown files.
    .pipe(filterMd)
    .pipe($.marked({
      gfm:         true,
      tables:      true,
      breaks:      false,
      sanitize:    false,
      smartypants: false,
      pedantic:    false,
      // Code highlighter.
      highlight: function(code, lang) {
        var result = lang ? hjs.highlight(lang, code) : hjs.highlightAuto(code);
        // Neuter interpolations. This is necessary to prevent atril from
        // evaluating them in code blocks.
        result.value = result.value.replace(/\{\{((?:[^}]|}(?=[^}]))*)\}\}/g, '{{<span>$1</span>}}');
        return result.value;
      }
    }))
    // Add the hljs code class.
    .pipe($.replace(/<pre><code class="(.*)">|<pre><code>/g,
                    '<pre><code class="hljs $1">'))
    // Return the other files.
    .pipe(filterMd.restore())
    // Render all html.
    .pipe($.statil({
      relativeDir: src.html,
      imports: imports
    }))
    // Change each `<filename>` into `<filename>/index.html`.
    .pipe($.rename(function(path) {
      switch (path.basename + path.extname) {
        case 'index.html': case '404.html': return;
      }
      path.dirname = pt.join(path.dirname, path.basename);
      path.basename = 'index';
    }))
    // Write to disk.
    .pipe(gulp.dest(dest.html));
});

gulp.task('docs:html:build', gulp.series('docs:html:clear', 'docs:html:compile'));

gulp.task('docs:html:watch', function() {
  $.watch(src.html + '/**/*', gulp.series('docs:html:build', reload));
});

/*--------------------------------- Styles ----------------------------------*/

gulp.task('docs:styles:clear', function() {
  return gulp.src(dest.styles, {read: false, allowEmpty: true})
    .pipe($.plumber())
    .pipe($.rimraf());
});

gulp.task('docs:styles:compile', function() {
  return gulp.src(src.stylesCore)
    .pipe($.plumber())
    .pipe($.less())
    .pipe($.autoprefixer())
    .pipe($.if(prod(), $.minifyCss({
      keepSpecialComments: 0,
      aggressiveMerging: false,
      advanced: false
    })))
    .pipe(gulp.dest(dest.styles))
    .pipe(bsync.reload({stream: true}));
});

gulp.task('docs:styles:build', gulp.series('docs:styles:clear', 'docs:styles:compile'));

gulp.task('docs:styles:watch', function() {
  $.watch(src.styles, gulp.series('docs:styles:build'));
});

/*--------------------------------- Images ----------------------------------*/

/**
 * Normally I put gulp-image-resize here, but this documentation doesn't need
 * image preprocessing.
 */

gulp.task('docs:images:clear', function() {
  return gulp.src(dest.img, {read: false, allowEmpty: true}).pipe($.rimraf());
});

gulp.task('docs:images:copy', function() {
  return gulp.src(src.img, {allowEmpty: true}).pipe(gulp.dest(dest.img));
});

gulp.task('docs:images:build', gulp.series('docs:images:clear', 'docs:images:copy'));

gulp.task('docs:images:watch', function() {
  $.watch(src.img, gulp.series('docs:images:build', reload));
});

/*--------------------------------- System ----------------------------------*/

gulp.task('docs:system:copy', function() {
  return gulp.src(src.system).pipe(gulp.dest(dest.html));
});

gulp.task('docs:system:build', gulp.series('docs:system:copy'));

gulp.task('docs:system:watch', function() {
  $.watch(src.system, gulp.series('docs:system:build', reload));
});

/*--------------------------------- Server ----------------------------------*/

gulp.task('server', function() {
  return bsync.init({
    startPath: '/atril/',
    server: {
      baseDir: dest.html,
      middleware: function(req, res, next) {
        req.url = req.url.replace(/^\/atril/, '/')
        next()
      }
    },
    port: 3945,
    online: false,
    ui: false,
    files: false,
    ghostMode: false,
    notify: false
  });
});

/*--------------------------------- Default ---------------------------------*/

// To build lib: `gulp lib:build`.

gulp.task('build', gulp.parallel(
  'lib:build', 'docs:scripts:build', 'docs:views:build', 'docs:html:build',
  'docs:styles:build', 'docs:images:build', 'docs:system:build'
));

gulp.task('watch', gulp.parallel(
  'lib:watch', 'docs:scripts:watch', 'docs:views:watch', 'docs:html:watch',
  'docs:styles:watch', 'docs:images:watch', 'docs:system:watch'
));

gulp.task('default', gulp.series('build', gulp.parallel('watch', 'server')));
