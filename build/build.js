var cleanDist = require('./tasks/clean_dist');
var copyGovUkTemplateAssets = require('./tasks/copy_govuk_template_assets')
var sass = require('./tasks/sass');

module.exports = function() {
  return new Promise(function(resolve, reject) {

    cleanDist()
      .then(copyGovUkTemplateAssets)
      .then(sass)
      .then(function() {
        resolve('dist/assets');
      })
      .catch(function(e) {
        reject(e);
      });

  });
}
