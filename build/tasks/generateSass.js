var components = require('../modules/components');
var sass = require('node-sass');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');

/**
 * Function to build out the SASS
 * @return {Promise} Promise which resolves with the collection of sass files
 */
function generateSass(config) {
  console.time('Generate SASS');

  mkdirp.sync(path.join(config.destination, 'assets/sass'));

  return components.getComponentsTree(config)
    .then(function(componentsTree) {

      return new Promise(function(resolve, reject) {

        var sassContents = [];

        // Build up our sass imports based on the dependency tree
        componentsTree.forEach(function(componentId) {

          // Check to see if the component exposes a stylesheet
          if(fs.existsSync(path.join(config.moduleDir, 'src', componentId, 'style.scss'))) {
            sassContents.push('@import "' + path.join(config.moduleDir, 'src', componentId) + '/style.scss";');
          }
        });

        // If we've got no stylesheets then bail out
        if(sassContents.length === 0) {
          return resolve([]);
        }

        // Turn the lines into a string suitable for passing to node-sass
        sassContents = sassContents.join('\n');


        // Write out separate versions of the stylesheet for the various IEs
        var stylesheets = [
          {
            'filename': 'elements-ie6',
            'base': '$is-ie: true; $ie-version: 6; $mobile-ie6: false;',
          },
          {
            'filename': 'elements-ie7',
            'base': '$is-ie: true; $ie-version: 7;',
          },
          {
            'filename': 'elements-ie8',
            'base': '$is-ie: true; $ie-version: 8;',
          },
          {
            'filename': 'elements',
            'base': '',
          }
        ];

        stylesheets.forEach(function(stylesheet) {
          stylesheet.data = stylesheet.base + sassContents;
          fs.writeFileSync(path.join(config.destination, 'assets/sass', stylesheet.filename) + '.scss', stylesheet.data);
        });

        console.timeEnd('Generate SASS');

        return resolve(stylesheets);
      });
    });
}

module.exports = generateSass;
