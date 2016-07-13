var extend = require('extend');
var path = require('path');
var cleanDist = require('./tasks/clean_dist');
var copy = require('./tasks/copy');
var generateSass = require('./tasks/generateSass');
var compileSass = require('./tasks/compileSass');
var javascript = require('./tasks/javascript');
var autoprefixer = require('./tasks/autoprefixer');
var componentBuilds = require('./tasks/componentBuilds');
var minifyJS = require('./tasks/minifyJS');
var pkg_up = require('pkg-up');

module.exports = function(options) {

  /**
   * Default options for the build
   *
   * `components` is configuration for which components should be included in the
   * build. This defaults to only Govuk core stuff. The local build scripts also include
   * the "Build" category which contains styles for example pages
   */
  var config = extend({
    includePath: '',
    mode: 'production',
    cache: true,
    components: true,
    destination: 'dist',
    moduleDir: path.dirname(pkg_up.sync(__dirname)),
    assetPath: ''
  }, options);

  // If we've not been passed an absolute path, make it a path relative to this module
  if(!path.isAbsolute(config.destination)) {
    config.destination = path.join(config.moduleDir, config.destination);
  }

  return new Promise(function(resolve, reject) {

    cleanDist(config)
      .then(function() {
        return copy.landregistryComponentAssets(config);
      })
      .then(function() {
        return componentBuilds(config);
      })
      .then(function() {
        return generateSass(config);
      })
      .then(function(stylesheets) {
        return compileSass(config, stylesheets);
      })
      .then(function() {
        return autoprefixer(config);
      })
      .then(function() {
        return javascript.compile(config);
      })
      .then(function() {
        if(config.mode === 'production') {
          return minifyJS(config);
        }
      })
      .then(function() {
        resolve(path.join(config.destination, 'assets'));
      })
      .catch(function(e) {
        reject(e);
      });

  });
}
