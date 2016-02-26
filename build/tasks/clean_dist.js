var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var path = require('path');

var clean = function(config) {
  console.time('Clean dist');

  return new Promise(function(resolve, reject) {
    rimraf(config.destination, function(err) {
      if(err) {
        reject(err);
        return;
      }

      mkdirp(path.join(config.destination, 'assets'), function(err) {
        if(err) {
          reject(err);
          return;
        }

        resolve();
        console.timeEnd('Clean dist');
      });

    });
  });
}

module.exports = clean;
