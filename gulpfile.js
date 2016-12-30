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

var useref = require('gulp-useref');
var lazypipe = require('lazypipe');
var uglify = require('gulp-uglify');
var ngAnnotate = require("gulp-ng-annotate");
var filter = require('gulp-filter');

gulp.task('default', [], function() {

});

var webAppDir = './webapp/';
var distDir = './dist/';

gulp.task('clean-dist', [], function () {
    return del([distDir+'**'], {force: true});
});

var assetsManifestFileName = "assets-manifest.json";
gulp.task('revision-assets', ['clean-dist'], function() {
    return gulp.src([webAppDir + "assets/**"], { base: webAppDir })
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

gulp.task('index-dist', ['revision-assets'], function() {

    var jsFilter = filter("**/*.js", {restore: true});
    var cssFilter = filter("**/*.css", {restore: true});
    var notIndexFilter = filter(['**/*', '!**/index.html'], {restore: true});

    var assetManifests = gulp.src(distDir + assetsManifestFileName);
    var minifiedCssManifest = gulp.src(distDir + cssManifestFileName);
    return gulp.src([webAppDir + 'index.html'])
        .pipe(revReplace({manifest: assetManifests}))
        .pipe(useref({
            transformPath: function(filePath) {
                return filePath.replace('student.css', 'student.less');
            }
        }, lazypipe().pipe(sourcemaps.init, { loadMaps: true })))
        .pipe(jsFilter)
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(less())
        .pipe(cssFilter.restore)
        .pipe(notIndexFilter)
        .pipe(rev())
        .pipe(notIndexFilter.restore)
        .pipe(revReplace())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(distDir));
});

gulp.task('serve-dist', ['index-dist'], function() {
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