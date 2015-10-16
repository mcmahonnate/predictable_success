var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var ngAnnotate = require('gulp-ng-annotate');
var concat = require('gulp-concat');
var angularFilesort = require('gulp-angular-filesort');
var inject = require('gulp-inject');
var iife = require('gulp-iife');

gulp.task('scripts', function() {
    return gulp.src('./talentdashboard/static/angular/feedback/**/*.js')
        .pipe(concat('feedback.js'))
        .pipe(iife())
        .pipe(ngAnnotate())
        .pipe(gulp.dest('./talentdashboard/staticfiles/'));
});

gulp.task('less', function () {
    return gulp.src('./talentdashboard/static/css/scoutmap/**/*.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest('./talentdashboard/staticfiles/CACHE/css/'));
});

gulp.task('watch', function() {
    gulp.watch('./talentdashboard/**/*.less', ['less']);
    gulp.watch('./talentdashboard/**/*.js', ['scripts']);
});

gulp.task('default', ['watch']);