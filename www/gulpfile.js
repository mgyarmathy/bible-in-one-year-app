var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var browserSync = require('browser-sync');
var browserify = require('browserify');
var source = require('vinyl-source-stream')

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('browser-sync', ['sass'], function() {
  browserSync({
    server: {
      baseDir: '.'
    }
  });
});

gulp.task('reload', function () {
  browserSync.reload();
})

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./css/'))
    //.pipe(browserSync.reload({stream:true}))
    .on('end', done);
});

gulp.task('browserify', function() {
  var bundleStream = browserify('./js/app.js').bundle()
 
  bundleStream
    .pipe(source('js/app.js'))
    //.pipe(streamify(uglify()))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('./js'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('watch', function() {
  gulp.watch(['js/**/*.js', '!js/bundle.js'], ['browserify']);
  gulp.watch(paths.sass, ['sass', 'reload']);
  gulp.watch(['index.html', 'templates/*.html'], ['reload']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('default', ['sass', 'browserify', 'browser-sync', 'watch']);
