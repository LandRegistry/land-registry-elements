var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs');
var postcss = require('postcss');
var autoprefixer = require('autoprefixer');


var prefix = function(config) {
  console.time('Autoprefixing CSS');

  return new Promise(function(resolve, reject) {
    var cssPath = path.join(config.destination, 'assets/stylesheets/elements.css');
    fs.readFile(cssPath, function(err, data) {

      postcss([ autoprefixer ]).process(data).then(function (result) {
        result.warnings().forEach(function (warn) {
          console.warn(warn.toString());
        });

        fs.writeFileSync(cssPath, result.css);

        console.timeEnd('Autoprefixing CSS');
        resolve();
      });
    });
  });
}

module.exports = prefix;
