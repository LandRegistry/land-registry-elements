var glob = require('glob');
var path = require('path');


// var app = require('../../build/server');

// Search for test suites embedded in component folders and require all of them
var files = glob.sync('src/**/tests/*.js');
files.forEach(function(file) {

  // describe.only('The component', function() {

    require(path.resolve('.', file))

  // });

});
