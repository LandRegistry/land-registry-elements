var components = require('../modules/components');
var sass = require('node-sass');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

/**
 * Custom node-sass importer to fetch sass files from the govuk_frontend_toolkit
 * node_modules folder
 *
 * @param  {String}   url     the path in import as-is, which LibSass encountered
 * @param  {String}   prev    the previously resolved path
 * @param  {Function} done    a callback function to invoke on async completion.
 *                            @see https://github.com/sass/node-sass#importer--v200---experimental
 */
var govukFrontendToolkitImporter = function(url, prev, done) {
  if (url.indexOf('govuk_frontend_toolkit') === 0) {
    return done({
      file: url.replace('govuk_frontend_toolkit', 'node_modules/govuk-elements-sass/node_modules/govuk_frontend_toolkit/stylesheets')
    });
  }

  done();
};

/**
 * Custom node-sass importer to fetch sass files from the govuk_elements
 * node_modules folder
 *
 * @param  {String}   url     the path in import as-is, which LibSass encountered
 * @param  {String}   prev    the previously resolved path
 * @param  {Function} done    a callback function to invoke on async completion.
 *                            @see https://github.com/sass/node-sass#importer--v200---experimental
 */
var govukElementsImporter = function(url, prev, done) {
  if (url.indexOf('govuk_elements') === 0) {
    return done({
      file: url.replace('govuk_elements', 'node_modules/govuk-elements-sass/public/sass/elements')
    });
  }

  done();
};

/**
 * Function to build out the CSS
 * @return {Promise} Promise which resolves with the path to the CSS output
 *                   when the SASS has been built
 */
function compileSass() {
  return components.getComponentsTree()
    .then(function(componentsTree) {

      return new Promise(function(resolve, reject) {

        // Build up our sass imports based on the dependency tree
        var sassContents = [];
        componentsTree.forEach(function(componentId) {
          if(fs.existsSync(path.join('src/elements', componentId, 'style.scss'))) {
            sassContents.push('@import "' + componentId + '/style.scss";');
          }
        });

        // Turn the lines into a string suitable for passing to node-sass
        sassContents = sassContents.join('\n');

        // Compile
        sass.render({
          data: sassContents,
          importer: [
            govukFrontendToolkitImporter,
            govukElementsImporter
          ],
          includePaths: [
            'src/elements'
          ],
          outputStyle: 'compressed'
        }, function(err, result) {
          if(err) {
            reject(err);
            return;
          }

          // Write out the sass
          mkdirp('dist/assets/stylesheets', function() {
            fs.writeFile('dist/assets/stylesheets/elements.css', result.css, function(err) {
              if(err) {
                reject(err);
                return;
              }

              resolve('dist/assets/stylesheets/style.css');
            });
          });
        });
      });
    });
}

module.exports = compileSass;
