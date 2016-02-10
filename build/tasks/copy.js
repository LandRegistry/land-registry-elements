var path = require('path');
var ncp = require('ncp').ncp;
var components = require('../modules/components');

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

/**
 * Copy assets from individual components folders as specified by the `from` and
 * `to` properties of the info.yaml files
 */
var landregistryComponentAssets = function(config) {
  var componentCopyOperations = [];

  return components.getComponentsTree(config)
    .then(function(components) {
      components.forEach(function(component) {

        if(component.copy) {
          componentCopyOperations.push(copy(path.join(component.path, component.copy.from), component.copy.to));
        }
      });

    })
    .then(function() {
      return new Promise(function(resolve, reject) {
        Promise
          .all(componentCopyOperations)
          .then(resolve)
          .catch(reject);
      });
    });

  // return copy('node_modules/govuk_template_mustache/assets', 'dist/assets');
}

var govUkTemplateAssets = function() {
  return copy('node_modules/govuk_template_mustache/assets', 'dist/assets');
}

var govUkToolkitAssets = function() {
  return copy('node_modules/govuk-elements-sass/node_modules/govuk_frontend_toolkit/images', 'dist/assets/images/icons');
}

module.exports = {
  'landregistryComponentAssets': landregistryComponentAssets,
  'govUkTemplateAssets': govUkTemplateAssets,
  'govUkToolkitAssets': govUkToolkitAssets,
};
