var WebFont = require('webfontloader');

/*global assetPath:true*/

WebFont.load({
  custom: {
    families: ['nta', 'ntatabularnumbers'],
    urls: [assetPath + '/stylesheets/fonts.css']
  }
});
