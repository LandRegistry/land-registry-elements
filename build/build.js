var cleanDist = require('./tasks/clean_dist');
var copyGovUkTemplateAssets = require('./tasks/copy_govuk_template_assets')
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
  var config = extend(options, {
    components: {
      'Govuk': true
    }
  });

  return new Promise(function(resolve, reject) {

    cleanDist()
      .then(copyGovUkTemplateAssets)
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
