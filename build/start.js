var build = require('./build');

build()
  .catch(function(err) {
    require('trace');
    require('clarify');
    console.trace(err);
  });

require('./server');
