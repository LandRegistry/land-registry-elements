var copy = require('../../../../build/tasks/copy');
var path = require('path');

var copyOperations = [
  {
    from: 'node_modules/govuk_frontend_toolkit/images',
    to: 'assets/images/icons',
  },
  {
    from: 'node_modules/govuk_template_mustache/assets/stylesheets',
    to: 'assets/stylesheets',
  },
  {
    from: 'node_modules/govuk_template_mustache/assets/images',
    to: 'assets/images',
  },
  {
    from: 'node_modules/govuk_template_mustache/assets/javascripts/govuk-template.js',
    to: 'assets/javascripts/govuk-template.js'
  }
];

module.exports = function(config) {

  var promises = [];

  copyOperations.forEach(function(operation) {
    operation.from = path.join(config.includePath, operation.from);
    operation.to = path.join(config.destination, operation.to);

    promises.push(copy.copy(operation.from, operation.to))
  });

  return Promise.all(promises);
}
