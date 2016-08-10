var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var ngAnnotate = require('gulp-ng-annotate');
var concat = require('gulp-concat');
var angularFilesort = require('gulp-angular-filesort');
var inject = require('gulp-inject');
var iife = require('gulp-iife');
var sourcemaps = require('gulp-sourcemaps');


gulp.task('devzones-scripts', function() {
    return gulp.src('./predictable_success/static/angular/devzones/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(angularFilesort())
        .pipe(concat('devzones.js'))
        .pipe(iife())
        .pipe(ngAnnotate())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./predictable_success/static/'));
});

gulp.task('profile-scripts', function() {
    return gulp.src('./predictable_success/static/angular/profile/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(angularFilesort())
        .pipe(concat('profile.js'))
        .pipe(iife())
        .pipe(ngAnnotate())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./predictable_success/static/'));
});

gulp.task('qualities-scripts', function() {
    return gulp.src('./predictable_success/static/angular/qualities/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(angularFilesort())
        .pipe(concat('qualities.js'))
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

gulp.task('scripts', ['devzones-scripts', 'profile-scripts', 'qualities-scripts']);

gulp.task('default', ['watch']);