var copy = require('../../../../build/tasks/copy');
var path = require('path');

module.exports = function(config) {
  var from = path.resolve(__dirname, '../../../../node_modules/leaflet/dist/leaflet.css');
  var to = path.resolve(__dirname, '../../../../node_modules/leaflet/dist/leaflet.scss');

  return copy.copy(from, to);
};
