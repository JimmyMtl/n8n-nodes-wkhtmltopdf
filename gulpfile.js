const gulp = require('gulp');

gulp.task('build:icons', function() {
  return gulp.src('nodes/**/icons/*.svg')
    .pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.series('build:icons'));
