var path = require('path');
var glob = require('glob');
var UglifyJS = require('uglify-js');
var fs = require('fs');

var grabFiles = function(config) {
  return new Promise(function(resolve, reject) {

    glob(path.join(config.destination, 'assets/**/*.js'), function(err, files) {
      if(err) {
        return reject(err);
      }

      resolve(files);
    });

  });
}

var minifyJS = function(files) {

  var promises = [];

  files.forEach(function(file) {
    promises.push(new Promise(function(resolve, reject) {

      var result = UglifyJS.minify(file, {
        compress: {
          screw_ie8: false
        },
        mangle:   {
          screw_ie8: false
        },
        output:   {
          screw_ie8: false
        },
      });

      fs.writeFile(file, result.code, function(err) {
        if(err) {
          return reject(err);
        }

        resolve();
      })

    }));
  });

  return Promise.all(promises);

}

module.exports = function(config) {
  console.time('Minifying JavaScript');

  return grabFiles(config)
    .then(function(files) {
      return minifyJS(files);
    })
    .then(function() {
      console.timeEnd('Minifying JavaScript')
    });
};
