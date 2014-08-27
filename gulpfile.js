var gulp = require('gulp');
var mocha = require('gulp-mocha');
var jsfmt = require('gulp-jsfmt');
var jshint = require('gulp-jshint');

gulp.task('fmt', function() {
  return gulp.src('./lib/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .pipe(jsfmt.format())
    .pipe(gulp.dest('./lib'));
});

gulp.task('fmt:test', function() {
  return gulp.src('./test/**/*-test.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .pipe(jsfmt.format())
    .pipe(gulp.dest('./test'));
});

gulp.task('test', function() {
  return gulp.src('./test')
    .pipe(mocha({
      reporter: 'dot',
      grep: 'fast'
    }));
});

gulp.task('default', ['fmt', 'fmt:test', 'test']);
