var cleanDist = require('./tasks/clean_dist');
var copyGovUkTemplateAssets = require('./tasks/govuk_template_assets')
var sass = require('./tasks/sass');

cleanDist()
  .then(copyGovUkTemplateAssets)
  .then(sass)
  .then(function() {
    console.log('CSS built');
  })
  .catch(function(e) {
    console.log(e);
  });
