var build = require('./build');

module.exports = function() {
  return new Promise(function(resolve, reject) {
    build({
        components: {
          'Govuk': true
        }
      })
      .then(function(directory) {
        console.log('Assets built to:', directory);
        resolve(directory);
      })
      .catch(function(err) {
        console.log(err);
        reject(err);
      });
  });
}
