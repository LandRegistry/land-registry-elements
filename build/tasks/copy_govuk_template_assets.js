var ncp = require('ncp').ncp;

var copyGovUkTemplateAssets = function() {
  return new Promise(function(resolve, reject) {
    ncp('node_modules/govuk_template_mustache/assets', 'dist/assets', function(err, files) {
      if(err) {
        reject(err);
        return;
      }

      resolve(files);
    });
  });
}

module.exports = copyGovUkTemplateAssets;
