var gulp = require('gulp');

var browserSync = require('browser-sync');
var proxyMiddleware = require('http-proxy-middleware');
var modRewrite = require('connect-modrewrite');

var sourcemaps = require('gulp-sourcemaps');
var less = require("gulp-less");

var rev = require('gulp-rev');
var revReplace = require("gulp-rev-replace");
var minifyCss = require('gulp-minify-css');

gulp.task('default', [], function() {

});

gulp.task('less-dev', [], function() {
    return gulp.src('./webapp/student.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(minifyCss())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dev/'));

});

gulp.task('serve', ['less-dev'], function() {
    var middleWares = [];

    var proxyOptions = {
        target: "http://localhost:8080",
        changeOrigin: true,
        ws: false,
        secure: false
    };

    proxyOptions.target = 'http://localhost:8080';

    middleWares.push(proxyMiddleware('/backend/', proxyOptions));
    middleWares.push(modRewrite(['^/(student)/[^\\.]*$ /$1/index.html [L]']));

    browserSync.init({
        notify: false,
        ui: false,
        port: 9090,
        startPath: '/student',
        server: {
            baseDir: ['.'],
            routes: {
                // '/teacher': '../frontend-teacher/target/classes/dist',
                '/student': 'webapp',

                '/student/student.css': 'dev/student.css',
                '/student/student.css.map': 'dev/student.css.map',

                '/student/universityConfig.js': '../config/otm-common/universityConfig.js',
            },
            middleware: middleWares
        }
    });
});

gulp.task('serve-dist', ['dist'], function() {
    var middleWares = [];

    var proxyOptions = {
        target: "http://localhost:8080",
        changeOrigin: true,
        ws: false,
        secure: false
    };

    proxyOptions.target = 'http://localhost:8080';

    middleWares.push(proxyMiddleware('/backend/', proxyOptions));
    middleWares.push(modRewrite(['^/(student)/[^\\.]*$ /$1/index.html [L]']));

    browserSync.init({
        notify: false,
        ui: false,
        port: 9090,
        startPath: '/student',
        server: {
            baseDir: ['.'],
            routes: {
                // '/teacher': '../frontend-teacher/target/classes/dist',
                '/student': 'dist',
                '/student/universityConfig.js': '../config/otm-common/universityConfig.js',
            },
            middleware: middleWares
        }
    });
});

gulp.task('dist', [], function() {

});