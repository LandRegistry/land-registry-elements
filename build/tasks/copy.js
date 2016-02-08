var ncp = require('ncp').ncp;

function copy(from, to) {
  return new Promise(function(resolve, reject) {
    ncp(from, to, function(err, files) {
      if(err) {
        reject(err);
        return;
      }

      resolve(files);
    });
  });
}

var govUkTemplateAssets = function() {
  return copy('node_modules/govuk_template_mustache/assets', 'dist/assets');
}

var govUkToolkitAssets = function() {
  return copy('node_modules/govuk-elements-sass/node_modules/govuk_frontend_toolkit/images', 'dist/assets/images/icons');
}

module.exports = {
  'govUkTemplateAssets': govUkTemplateAssets,
  'govUkToolkitAssets': govUkToolkitAssets,
};
