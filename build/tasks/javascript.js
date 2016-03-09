var components = require('../modules/components');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var browserify = require('browserify');
var browserify_incremental = require('browserify-incremental');

/**
 * Helper to sort the components into bundles
 */
function bundleSort(components) {
  var bundles = {};

  components.forEach(function(component) {
    var bundle;

    // If a bundle is defined in the info file use it, otherwise default to the landregistry bundle
    if(typeof component['js-bundle'] !== 'undefined') {
      bundle = component['js-bundle'];
    } else {
      bundle = 'landregistry';
    }

    // Collect the components together against their respective bundles
    if(typeof bundles[bundle] === 'undefined') {
      bundles[bundle] = [];
    }

    bundles[bundle].push(component);
  });

  return bundles;
}

/**
 * Function to build out the JavaScript
 * @return {Promise} Promise which resolves with the path to the JS output
 *                   when the JS has been built
 */
function compileJavaScript(config) {
  console.time('Compile JavaScript');

  return components.getComponents(config)
    .then(bundleSort)
    .then(function(bundles) {

      return new Promise(function(resolve, reject) {

        var bundleQueue = [];

        // Create a new browserify build for each bundle
        for(var bundleKey in bundles) {
          if(bundles.hasOwnProperty(bundleKey)) {

            bundleQueue.push(new Promise(function(resolve, reject) {

              var bundle = bundles[bundleKey];

              var b;
              var browserfyConfig = {
                transform: [
                  require('hoganify')
                ]
              };

              // If we're in production mode, turn off debug and enable uglification
              // and use the vanilla browserify module
              if(config.mode === 'production') {
                b = browserify(browserfyConfig);
                b.transform({ global: true }, require('uglifyify'));
              } else {
                // Otherwise use debug mode
                browserfyConfig.debug = true;

                // And do incremental builds for speed
                b = browserify_incremental(browserfyConfig, {
                  cacheFile: '.tmp/browserify-incremental-' + bundleKey + '.json'
                });
              }

              // Build up our bundle based on the components for this bundle
              bundle.forEach(function(component) {

                // Check to see if the component exposes a js file
                if(fs.existsSync(path.join(component.path, 'controller.js'))) {
                  b.add(path.join(component.path, 'controller.js'));
                }
              });

              // Write the resulting JavaScript out to disk
              var stream = fs.createWriteStream(path.join(config.destination, 'assets/javascripts/' + bundleKey + '.js'), { flags : 'w' });
              b.bundle().pipe(stream);

              (function(bundleKey) {

                stream.on('close', function () {
                  resolve(path.join(config.destination, 'assets/javascripts/' + bundleKey + '.js'));
                });

                stream.on('error', function (e) {
                  reject(e);
                });

              })(bundleKey);

            }));
          }
        };

        // Process all the bundles defined above
        Promise.all(bundleQueue)
          .then(resolve)
          .then(function() {
            console.timeEnd('Compile JavaScript');
          })
          .catch(reject);

      });
    });
}

module.exports = {
  compile: compileJavaScript,
  sort: bundleSort
}
