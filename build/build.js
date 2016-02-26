var extend = require('extend');
var path = require('path');
var cleanDist = require('./tasks/clean_dist');
var copy = require('./tasks/copy');
var sass = require('./tasks/sass');
var javascript = require('./tasks/javascript');
var polyfillJS = require('./tasks/polyfillJS');

module.exports = function(options) {

  /**
   * Default options for the build
   *
   * `components` is configuration for which components should be included in the
   * build. This defaults to only Govuk core stuff. The local build scripts also include
   * the "Build" category which contains styles for example pages
   */
  var config = extend({
    cache: true,
    components: true,
    destination: 'dist'
  }, options);

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
        return javascript(config);
      })
      .then(function() {
        return polyfillJS(config)
      })
      .then(function() {
        resolve(path.join(config.destination, 'assets'));
      })
      .catch(function(e) {
        reject(e);
      });

  });
}
