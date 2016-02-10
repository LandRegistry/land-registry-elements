'use strict';

var polyfillService = require('polyfill-service');
var fs = require('fs');

function polyfillJS() {
  return new Promise(function(resolve, reject) {
    polyfillService
      .getPolyfillString({
        uaString: 'I WISH THIS WASNT REQUIRED, I JUST WANT TO SPECIFY THE FEATURES!',
        minify: false,
        unknown: 'polyfill',
        features: {
          'Event': { flags: ['always'] },
          'Element.prototype.classList': { flags: ['always'] },
          'Array.prototype.forEach': { flags: ['always'] }
        }
      })
      .then(function(bundleString) {

        fs.writeFile('dist/assets/javascripts/ie8-9-polyfills.js', bundleString, function(err) {
          if (err) {
            reject(err);
          }

          resolve();
        });

      });
  });
};

module.exports = polyfillJS;
