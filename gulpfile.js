var gulp = require('gulp');
var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');

gulp.task('lint', function() {
  return gulp.src(['./lib/**/*.js', '*.js', './test/**/*-test.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('lint:test', function() {
  return gulp.src('./test/**/*-test.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('test', function() {
  return gulp.src('./test')
    .pipe(mocha({
      reporter: 'dot',
      grep: 'fast'
    }));
});

gulp.task('watch', function() {
  gulp.watch(['*.js', 'lib/**/*.js', 'test/**/*.js'], ['default']);
});

gulp.task('default', ['lint', 'test']);

