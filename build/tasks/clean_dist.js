var rimraf = require('rimraf');
var mkdirp = require('mkdirp');

var clean = function() {
  return new Promise(function(resolve, reject) {
    rimraf('dist', function(err) {
      if(err) {
        reject(err);
        return;
      }

      mkdirp('dist/assets', function(err) {
        if(err) {
          reject(err);
          return;
        }

        resolve();
      });

    });
  });
}

module.exports = clean;
