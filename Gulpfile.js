var gulp = require('gulp')
var landRegistryGulpTasks = require('land-registry-gulp-tasks')

var path = require('path')

var config = {
  'applicationPath': './demo/demo',
  'sourcePath': './demo/demo/assets/src',
  'destinationPath': './demo/demo/assets/dist',
  'sassPath': 'scss/*.scss',
  'localhost': 'localhost:8080',
  'browsersyncPort': 3900,
  'lintingPaths': false
}

for (var task in landRegistryGulpTasks) {
  landRegistryGulpTasks[task](gulp, config)
}

var existingWatch = gulp.tasks.watch.fn

gulp.task('watch', function () {
  gulp.watch(path.join('src/**/*.scss'), ['sass', 'sass-lint'])
  gulp.watch(path.join('src/**/*.js'), ['js', 'standardjs'])
  existingWatch()
})
