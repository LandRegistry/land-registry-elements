var cleanDist = require('./tasks/clean_dist');
var copy = require('./tasks/copy');
var sass = require('./tasks/sass');
var extend = require('extend');

module.exports = function(options) {

  /**
   * Default options for the build
   *
   * `components` is configuration for which components should be included in the
   * build. This defaults to only Govuk core stuff. The local build scripts also include
   * the "Build" category which contains styles for example pages
   */
  var config = extend({
    components: {
      'Govuk': true
    }
  }, options);

  return new Promise(function(resolve, reject) {

    cleanDist()
      .then(copy.govUkTemplateAssets)
      .then(copy.govUkToolkitAssets)
      .then(function() {
        sass(config);
      })
      .then(function() {
        resolve('dist/assets');
      })
      .catch(function(e) {
        reject(e);
      });

  });
}
