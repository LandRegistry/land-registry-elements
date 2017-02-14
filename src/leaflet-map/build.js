var copy = require('../../../../build/tasks/copy');
var path = require('path');


module.exports = function(config) {
  var promises = [];

  var copyOperations = [
    {
      from: path.join(config.moduleDir, 'node_modules/leaflet/dist/leaflet.css'),
      to: path.join(config.moduleDir, 'node_modules/leaflet/dist/leaflet.scss')
    },
    {
      from: path.join(config.moduleDir, 'node_modules/leaflet/dist/images'),
      to: path.join(config.destination, 'assets/images/leaflet')
    }
  ];

  copyOperations.forEach(function(operation) {
    promises.push(copy.copy(operation.from, operation.to))
  });

  return Promise.all(promises);
};
