var gulp = require('gulp');

var browserSync = require('browser-sync');
var proxyMiddleware = require('http-proxy-middleware');
var modRewrite = require('connect-modrewrite');

gulp.task('default', [], function() {

});

gulp.task('serve', [], function() {
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