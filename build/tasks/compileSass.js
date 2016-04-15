var components = require('../modules/components');
var sass = require('node-sass');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

/**
 * Function to build out the CSS
 * @return {Promise} Promise which resolves with the path to the CSS output
 *                   when the SASS has been built
 */
function compileSass(config, stylesheets) {
  console.time('Compile SASS');

  var promises = [];

  stylesheets.forEach(function(stylesheet) {
    promises.push(new Promise(function(resolve, reject) {

      // Compile
      sass.render({
        data: stylesheet.data,
        includePaths: [
          config.moduleDir,
          path.join(config.moduleDir, 'src/elements')
        ],
        outputStyle: (config.mode === 'production') ? 'compressed' : 'expanded'
      }, function(err, result) {
        if(err) {
          reject(err);
          return;
        }

        // Write out the sass
        mkdirp(path.join(config.destination, 'assets/stylesheets'), function() {
          fs.writeFile(path.join(config.destination, 'assets/stylesheets', stylesheet.filename) + '.css', result.css, function(err) {
            if(err) {
              reject(err);
            }

            resolve(path.join(config.destination, 'assets/stylesheets'));
          });
        });
      });
    }));
  });

  return Promise.all(promises).then(function() {
    console.timeEnd('Compile SASS');
  });
}

module.exports = compileSass;
