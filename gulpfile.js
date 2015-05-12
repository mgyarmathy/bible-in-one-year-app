var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var rename = require('gulp-rename');

/**
 * Launch the Server
 */
gulp.task('browser-sync', ['sass'], function() {
    browserSync({
        server: {
            baseDir: './'
        }
    });
});

/**
 * Reload the static site
 */
gulp.task('reload', function () {
    browserSync.reload();
});

/**
 * Compile files from _scss into css (for live injecting)
 */
gulp.task('sass', function () {
    return gulp.src('_sass/*.scss')
        .pipe(sass({
            includePaths: ['_sass'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({stream:true}));
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

/**
 * Watch files and reload when changed
 */
gulp.task('watch', function () {
    gulp.watch('js/app.js', ['browserify']);
    gulp.watch('_sass/**/*.scss', ['sass']);
    gulp.watch(['index.html'], ['reload']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * launch BrowserSync, and watch files.
 */
gulp.task('default', ['sass', 'browserify', 'browser-sync', 'watch']);