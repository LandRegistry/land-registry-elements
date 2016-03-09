console.time('Total build time');

var path = require('path');

var build = require('./build');

var results = function(config) {
  return new Promise(function(resolve, reject) {
    build(config)
      .then(function(directory) {
        console.timeEnd('Total build time');
        console.log('Assets built to:', directory);

        resolve(directory);
      })
      .catch(function(err) {
        require('trace');
        require('clarify');
        console.trace(err);
        reject(err);
      });
  });
}

module.exports = results;
