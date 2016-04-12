var ShowHideContent = require('./ShowHideContent');

var blockLabels = document.querySelectorAll('.block-label input[type="radio"], .block-label input[type="checkbox"]');
[].forEach.call(blockLabels, function(blockLabel){
  var instance = new ShowHideContent(blockLabel);
  instance.create();
});
