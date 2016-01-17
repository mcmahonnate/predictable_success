var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var ngAnnotate = require('gulp-ng-annotate');
var concat = require('gulp-concat');
var angularFilesort = require('gulp-angular-filesort');
var inject = require('gulp-inject');
var iife = require('gulp-iife');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('checkins-scripts', function() {
    return gulp.src('./talentdashboard/static/angular/checkins/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(angularFilesort())
        .pipe(concat('checkins.js'))
        .pipe(iife())
        .pipe(ngAnnotate())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./talentdashboard/static/'));
});

gulp.task('feedback-scripts', function() {
    return gulp.src('./talentdashboard/static/angular/feedback/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(angularFilesort())
        .pipe(concat('feedback.js'))
        .pipe(iife())
        .pipe(ngAnnotate())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./talentdashboard/static/'));
});

gulp.task('projects-scripts', function() {
    return gulp.src('./talentdashboard/static/angular/projects/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(angularFilesort())
        .pipe(concat('projects.js'))
        .pipe(iife())
        .pipe(ngAnnotate())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./talentdashboard/static/'));
});

gulp.task('less', function () {
    return gulp.src('./talentdashboard/static/css/scoutmap/**/*.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest('./talentdashboard/staticfiles/CACHE/css/'));
});

gulp.task('watch', function() {
    gulp.watch('./talentdashboard/**/*.js', ['scripts']);
});

gulp.task('scripts', ['checkins-scripts', 'feedback-scripts', 'projects-scripts']);

gulp.task('default', ['watch']);