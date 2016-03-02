var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs');
var autopolyfiller = require('autopolyfiller')();

var polyfill = function(config, bundles) {
  console.time('Generating polyfills');

  return new Promise(function(resolve, reject) {
      bundles.forEach(function(bundle) {
        autopolyfiller.add(fs.readFileSync(bundle));
      });

      autopolyfiller.exclude(['Promise'])

      fs.writeFileSync(path.join(config.destination, 'assets/javascripts/polyfills.js'), autopolyfiller.toString());

      resolve();
      console.timeEnd('Generating polyfills');
  });
}

module.exports = polyfill;
