var components = require('../../build/modules/components');
var fs = require('fs');
var mkdirp = require('mkdirp');

components.getComponents()
  .then(function(components) {
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
  });
