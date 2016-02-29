var path = require('path');
var ncp = require('ncp').ncp;
var components = require('../modules/components');
var mkdirp = require('mkdirp');

function copy(from, to) {
  console.time('Copy from ' + from + ' to ' + to);
  return new Promise(function(resolve, reject) {
    mkdirp.sync(to);

    ncp(from, to, function(err, files) {
      if(err) {
        reject(err);
        return;
      }

      resolve(files);
      console.timeEnd('Copy from ' + from + ' to ' + to);
    });
  });
}

/**
 * Copy assets from individual components folders as specified by the `from` and
 * `to` properties of the info.yaml files
 */
var landregistryComponentAssets = function(config) {
  var componentCopyOperations = [];

  return new Promise(function(resolve, reject) {

    components.getComponents(config)
      .then(function(components) {
        components.forEach(function(component) {

          if(component.copy) {
            componentCopyOperations.push(copy(path.join(component.path, component.copy.from), path.join(config.destination, component.copy.to)));
          }
        });

        Promise
          .all(componentCopyOperations)
          .then(resolve)
          .catch(reject);
      });

  });
}

var govUkTemplateAssets = function(config) {
  return copy('node_modules/govuk_template_mustache/assets', path.join(config.destination, 'assets'));
}

var govUkToolkitAssets = function(config) {
  return copy('node_modules/govuk-elements-sass/node_modules/govuk_frontend_toolkit/images', path.join(config.destination, 'assets/images/icons'));
}

module.exports = {
  'landregistryComponentAssets': landregistryComponentAssets,
  'govUkTemplateAssets': govUkTemplateAssets,
  'govUkToolkitAssets': govUkToolkitAssets,
};
