var copy = require('../../../../build/tasks/copy');
var path = require('path');


module.exports = function(config) {
  var promises = [];

  var copyOperations = [
    {
      from: path.join(config.moduleDir, 'src/elements/land-registry/favicon/images'),
      to: path.join(config.destination, 'assets/images')
    }
  ];

  copyOperations.forEach(function(operation) {
    promises.push(copy.copy(operation.from, operation.to))
  });

  return Promise.all(promises);
};
