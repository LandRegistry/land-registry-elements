var build = require('./build');
require('./server');

build({
    components: true
  })
  .then(function(directory) {
    console.log('Assets built to:', directory);
  })
  .catch(function(err) {
    console.log(err);
  });
