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

        // Write out separate versions of the stylesheet for the various IEs
        // @TODO: Does this really live here? Could we have it in files on disk in a more "traditional" way? Is there too much magic here?
        var stylesheets = [
          {
            'filename': 'elements-ie6.css',
            'base': '$is-ie: true; $ie-version: 6; $mobile-ie6: false;',
          },
          {
            'filename': 'elements-ie7.css',
            'base': '$is-ie: true; $ie-version: 7;',
          },
          {
            'filename': 'elements-ie8.css',
            'base': '$is-ie: true; $ie-version: 8;',
          },
          {
            'filename': 'elements.css',
            'base': '',
          }
        ];

        stylesheets.forEach(function(stylesheet) {

          // Compile
          sass.render({
            data: stylesheet.base + sassContents,
            importer: [
              govukFrontendToolkitImporter,
              govukElementsImporter
            ],
            includePaths: [
              'src/elements'
            ],
            outputStyle: 'expanded'
          }, function(err, result) {
            if(err) {
              reject(err);
              return;
            }

            // Write out the sass
            mkdirp('dist/assets/stylesheets', function() {
              fs.writeFile('dist/assets/stylesheets/' + stylesheet.filename, result.css, function(err) {
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
    });
}

module.exports = compileSass;
