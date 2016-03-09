console.time('Total build time');

var path = require('path');

var build = require('./build');

build()
  .then(function(directory) {
    console.timeEnd('Total build time');
    console.log('Assets built to:', directory);
  })
  .catch(function(err) {
    require('trace');
    require('clarify');
    console.trace(err);
  });
