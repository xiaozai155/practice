let { series, parallel, src, dest , watch } = require('gulp');
let babel = require('gulp-babel');
let del = require('delete');
let less = require('gulp-less');
let path = require('path');
let browserSync = require("browser-sync").create();
var reload = browserSync.reload;

// The `clean` function is not exported so it can be considered a private task.
// It can still be used within the `series()` composition.
function clean(cb) {
    // body omitted
    del(['dist/*'], cb);
}

function jsStreamTask() {
    return src('./src/js/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(dest('./dist/js'));
}

function compileLess_01() {
    return src('./src/product/less/*.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(dest('./src/product/css/'));
}
function compileLess_02() {
    return src('./src/baidu/less/*.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(dest('./src/baidu/css/'));
}

function compileLess() {
    return src('./src/less/*.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(dest('./src/css/'));
}

function cleanCss(cb) {
    // body omitted
    del(['./src/css/'], cb);
}

function dev() {
    browserSync.init({
        server: {
            baseDir: "./",
            directory: true
          },
        files: ["./src/*"],
        port: 8686
    });
    cleanCss();
    compileLess();
    compileLess_01();
    compileLess_02();
    watch(['./src/js/*', './src/less/*', './src/product/'], function(cb) {
        // body omitted
        compileLess();
        compileLess_01();
        compileLess_02();
        cb();
        reload();
    });
}

exports.default = series(dev);
