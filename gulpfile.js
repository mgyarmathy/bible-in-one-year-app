var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');

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

/**
 * Watch files and reload when changed
 */
gulp.task('watch', function () {
    gulp.watch('_sass/**/*.scss', ['sass']);
    gulp.watch(['index.html', 'js/app.js'], ['reload']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * launch BrowserSync, and watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);