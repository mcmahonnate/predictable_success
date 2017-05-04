var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var ngAnnotate = require('gulp-ng-annotate');
var concat = require('gulp-concat');
var angularFilesort = require('gulp-angular-filesort');
var inject = require('gulp-inject');
var iife = require('gulp-iife');
var sourcemaps = require('gulp-sourcemaps');


gulp.task('leadership-style-scripts', function() {
    return gulp.src('./predictable_success/static/angular/leadership-style/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(angularFilesort())
        .pipe(concat('leadership-style.js'))
        .pipe(iife())
        .pipe(ngAnnotate())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./predictable_success/static/'));
});

gulp.task('less', function () {
    return gulp.src('./predictable_success/static/css/scoutmap/**/*.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest('./predictable_success/staticfiles/CACHE/css/'));
});

gulp.task('watch', function() {
    gulp.watch('./predictable_success/**/*.js', ['scripts']);
});

gulp.task('scripts', ['leadership-style-scripts',]);

gulp.task('default', ['watch']);