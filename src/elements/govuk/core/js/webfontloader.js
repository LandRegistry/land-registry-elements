var WebFont = require('webfontloader');
var PubSub = require('pubsub-js');

/*global assetPath:true*/

WebFont.load({
  custom: {
    families: ['nta', 'ntatabularnumbers'],
    urls: [assetPath + '/stylesheets/fonts.css']
  },
  active: function() {
    PubSub.publish('webfonts.active');
  }
});
