var build = require('./build');

build()
  .then(function(directory) {
    console.log('Assets built to:', directory);
  })
  .catch(function(e) {
    console.log(e);
  });
