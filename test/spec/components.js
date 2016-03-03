var glob = require('glob');
var path = require('path');

// Search for test suites embedded in component folders and require all of them
var files = glob.sync('src/**/tests/*.js');
files.forEach(function(file) {
  require(path.resolve('.', file))
});
