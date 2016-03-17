var fs = require('fs');
var path = require('path');
var components = require('../modules/components');

var componentBuilds = function(config) {
  var componentBuildOperations = [];

  return components.getComponentsTree(config)
    .then(components.populateTree)
    .then(function(componentsTree) {

      componentsTree.forEach(function(component) {
        if (fs.existsSync(path.join(component.path, 'build.js'))) {
          componentBuildOperations.push(require(path.join(component.path, 'build.js')));
        }
      });

      return Promise.all(componentBuildOperations);
    });
}

module.exports = componentBuilds;
