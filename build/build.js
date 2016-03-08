var extend = require('extend');
var path = require('path');
var cleanDist = require('./tasks/clean_dist');
var copy = require('./tasks/copy');
var sass = require('./tasks/sass');
var javascript = require('./tasks/javascript');
var polyfill = require('./tasks/autopolyfiller');
var autoprefixer = require('./tasks/autoprefixer');
var pkg_dir = require('pkg-dir');

module.exports = function(options) {

  /**
   * Default options for the build
   *
   * `components` is configuration for which components should be included in the
   * build. This defaults to only Govuk core stuff. The local build scripts also include
   * the "Build" category which contains styles for example pages
   */
  var config = extend({
    mode: 'development',
    cache: true,
    components: true,
    destination: 'dist'
  }, options);

  config.destination = path.join(pkg_dir.sync(), config.destination);

  return new Promise(function(resolve, reject) {

    cleanDist(config)
      .then(function() {
        return copy.govUkTemplateAssets(config);
      })
      .then(function() {
        return copy.govUkToolkitAssets(config);
      })
      .then(function() {
        return copy.landregistryComponentAssets(config);
      })
      .then(function() {
        return sass(config);
      })
      .then(function() {
        return autoprefixer(config);
      })
      .then(function() {
        return javascript.compile(config);
      })
      .then(function(bundles) {
        return polyfill(config, bundles);
      })
      .then(function() {
        resolve(path.join(config.destination, 'assets'));
      })
      .catch(function(e) {
        reject(e);
      });

  });
}
