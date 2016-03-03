var Conduct = require('conduct.js');
var MobileCrumbs = require('./MobileCrumbs');

var crumbs = document.querySelectorAll('.breadcrumbs ol');
var instances = [];

[].forEach.call(crumbs, function(item) {
  instances.push(new MobileCrumbs(item));
});

new Conduct({
  'media_queries': [
    {
      query: '(max-width: 640px)',
      match: function() {
        instances.forEach(function(instance) {
          instance.create();
        });
      },
      unmatch: function() {
        instances.forEach(function(instance) {
          instance.destroy();
        });
      }
    }
  ]
});
