var gulp = require('gulp')
var landRegistryGulpTasks = require('land-registry-gulp-tasks')

var path = require('path')

var config = {
  'applicationPath': './demo/demo',
  'assetsPath': 'assets',
  'sassPath': 'src/scss/*.scss',
  'localhost': 'localhost:8080'
}

config.assetsPath = path.join(config.applicationPath, config.assetsPath)

for (var task in landRegistryGulpTasks) {
  landRegistryGulpTasks[task](gulp, config)
}

var existingWatch = gulp.tasks.watch.fn

gulp.task('watch', function () {
  gulp.watch(path.join('src/**/*.scss'), ['sass', 'sass-lint'])
  gulp.watch(path.join('src/**/*.js'), ['js', 'standardjs'])
  existingWatch()
})
