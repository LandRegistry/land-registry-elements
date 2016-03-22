var path = require('path');
var fs = require('fs');
var components = require('../modules/components');
var mkdirp = require('mkdirp');
var ncp = require('ncp').ncp;

function copy(from, to) {
  console.time('Copy from ' + from + ' to ' + to);
  return new Promise(function(resolve, reject) {

    var stat = fs.statSync(from);

    if(stat.isFile()) {
      fs.createReadStream(from)
        .pipe(fs.createWriteStream(to))
        .on('finish', function() {
          resolve(to);
          console.timeEnd('Copy from ' + from + ' to ' + to);
        })
        .on('error', function(err) {
          reject(err);
        });
    } else {
      mkdirp.sync(to);

      ncp(from, to, function(err, files) {
        if(err) {
          reject(err);
          return;
        }

        resolve(files);
        console.timeEnd('Copy from ' + from + ' to ' + to);
      });
    }
  });
}

/**
 * Copy assets from individual components folders as specified by the `from` and
 * `to` properties of the info.yaml files
 */
var landregistryComponentAssets = function(config) {
  var componentCopyOperations = [];

  return components.getComponentsTree(config)
    .then(components.populateTree)
    .then(function(componentsTree) {

      componentsTree.forEach(function(component) {
        if(component.copy) {
          component.copy.forEach(function(copyOperation) {
            componentCopyOperations.push(copy(path.resolve(component.path, copyOperation.from), path.join(config.destination, copyOperation.to)));
          });
        }
      });

      return Promise.all(componentCopyOperations);
    });
}

var govUkTemplateAssets = function(config) {
  return copy(path.join(config.moduleDir, 'node_modules/govuk_template_mustache/assets'), path.join(config.destination, 'assets'));
}

var govUkToolkitAssets = function(config) {
  return copy(path.join(config.moduleDir, 'node_modules/govuk_frontend_toolkit/images'), path.join(config.destination, 'assets/images/icons'));
}

module.exports = {
  'landregistryComponentAssets': landregistryComponentAssets,
  'govUkTemplateAssets': govUkTemplateAssets,
  'govUkToolkitAssets': govUkToolkitAssets,
  'copy': copy
};
