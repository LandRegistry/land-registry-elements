var components = require('../modules/components');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var browserify = require('browserify');
var browserify_incremental = require('browserify-incremental');

/**
 * Function to build out the JavaScript
 * @return {Promise} Promise which resolves with the path to the JS output
 *                   when the JS has been built
 */
function compileJavaScript(config) {
  console.time('Compile JavaScript');

  return components.getComponentsTree(config)
    .then(function(componentsTree) {

      return new Promise(function(resolve, reject) {

        var b;
        var browserfyConfig = {
          debug: true,
          transform: [
            require('hoganify')
          ]
        };

        if(config.mode === 'production') {
          b = browserify(browserfyConfig);
          b.plugin('minifyify', {
            map: 'landregistry.js.map'
          });
        } else {
          b = browserify_incremental(browserfyConfig, {
            cacheFile: '.tmp/browserify-incremental.json'
          });
        }

        // Build up our JS based on the dependency tree
        componentsTree.forEach(function(componentId) {

          // Check to see if the component exposes a js file
          if(fs.existsSync(path.join('src', componentId, 'controller.js'))) {
            b.add(path.join('src', componentId, 'controller.js'));
          }
        });

        var stream = fs.createWriteStream(path.join(config.destination, 'assets/javascripts/landregistry.js'), { flags : 'w' });
        b
          .bundle(function(err, src, map) {
            fs.writeFileSync(path.join(config.destination, 'assets/javascripts/landregistry.js.map'), map);
          })
          .pipe(stream);

        stream.on('close', function () {
          resolve(path.join(config.destination, 'assets/javascripts/landregistry.js.map'));
          console.timeEnd('Compile JavaScript');
        });

        stream.on('error', function (e) {
          reject(e);
        });

      });
    });
}

module.exports = compileJavaScript;
