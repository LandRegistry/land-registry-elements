var components = require('../../build/modules/components');
var fs = require('fs');
var mkdirp = require('mkdirp');

module.exports = components.getComponents()
  .then(function(components) {
    return new Promise(function(resolve, reject) {
      var urls = [];

      components.forEach(function(component) {
        for(variant in component.variants) {
          if(component.variants.hasOwnProperty(variant)) {

            urls.push('http://localhost:3000/components/' + component.id + '/' + variant);
          }
        }
      });

      mkdirp('.tmp', function() {
        fs.writeFile('.tmp/testURLs.json', JSON.stringify(urls), function(err) {
          if(err) {
            console.log(err);
          }
        });
      });

      resolve(urls);
    });
  });
