var gulp = require('gulp');

var browserSync = require('browser-sync');
var proxyMiddleware = require('http-proxy-middleware');
var modRewrite = require('connect-modrewrite');
var del = require('del');

var sourcemaps = require('gulp-sourcemaps');
var less = require("gulp-less");

var rev = require('gulp-rev');
var revReplace = require("gulp-rev-replace");
var minifyCss = require('gulp-minify-css');

gulp.task('default', [], function() {

});

var webAppDir = './webapp/';
var distDir = './dist/';

gulp.task('clean-dist', [], function () {
    return del([distDir+'**'], {force: true});
});

var assetsManifestFileName = "assets-manifest.json";
gulp.task('revision-assets', ['clean-dist'], function() {
    return gulp.src([webAppDir + "/assets/**"]) // css?
        .pipe(rev())
        .pipe(gulp.dest(distDir))
        .pipe(rev.manifest(assetsManifestFileName, {base: process.cwd(), merge: true}))
        .pipe(gulp.dest(distDir));
});

var cssManifestFileName = "css-manifest.json";
gulp.task('less-dist', ['clean-dist'], function() {
    return gulp.src(webAppDir + 'student.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(minifyCss())
        .pipe(rev())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(distDir))
        .pipe(rev.manifest(cssManifestFileName, {base: '.', merge: true}))
        .pipe(gulp.dest(distDir));

});
gulp.task('less-dev', [], function() {
    return gulp.src(webAppDir + 'student.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(minifyCss())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dev/'));

});

gulp.task('serve-dev', ['less-dev'], function() {
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