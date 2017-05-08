var gulp = require('gulp')
var landRegistryGulpTasks = require('land-registry-gulp-tasks')

var path = require('path')

var config = {
  'applicationPath': './demo',
  'assetsPath': 'assets',
  'sassPath': 'src/scss/*.scss',
  'localhost': 'localhost:9996'
}

config.assetsPath = path.join(config.applicationPath, config.assetsPath)

for (task in landRegistryGulpTasks) {
  landRegistryGulpTasks[task](gulp, config)
}
