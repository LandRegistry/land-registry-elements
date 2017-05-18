var gulp = require('gulp')
var landRegistryGulpTasks = require('land-registry-gulp-tasks')

var path = require('path')

var config = {
  'applicationPath': './demo',
  'assetsPath': 'demo/assets',
  'sassPath': 'src/scss/*.scss',
  'localhost': 'localhost:9000'
}

config.assetsPath = path.join(config.applicationPath, config.assetsPath)

for (var task in landRegistryGulpTasks) {
  landRegistryGulpTasks[task](gulp, config)
}
