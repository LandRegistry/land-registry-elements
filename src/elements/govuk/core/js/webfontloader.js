var WebFont = require('webfontloader');
var PubSub = require('pubsub-js');

/*global assetPath:true*/

// Wait for the page to load so that fonts do not block an initial page render
// Causes a FOUT, but enables the page to be readable earlier
window.addEventListener('load', function() {

  WebFont.load({
    custom: {
      families: ['nta', 'ntatabularnumbers'],
      urls: [assetPath + '/stylesheets/fonts.css']
    },
    active: function() {
      PubSub.publish('webfonts.active');
    }
  });

});
