console.time('Total build time');

var build = require('./build');

build({
    components: true
  })
  .then(function(directory) {
    console.timeEnd('Total build time');
    console.log('Assets built to:', directory);
  })
  .catch(function(err) {
    console.log(err);
  });
