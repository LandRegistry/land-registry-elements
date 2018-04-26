module.exports = (gulp, config) => {
  gulp.task('copy', gulp.parallel([
    'copyGov',
    'jquery',
    'images'
  ]))

  gulp.task('build', gulp.parallel([
    'sass',
    'js',
    'js-vendor'
  ]))

  gulp.task('default', gulp.parallel([
    'build'
  ]))
}
