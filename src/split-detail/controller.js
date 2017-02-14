'use strict';

var SplitDetail = require('./SplitDetail');

var instance;
var splitDetailTriggers = document.querySelectorAll('.split-detail-trigger');

for (var i = 0; i < splitDetailTriggers.length; i++) {
  instance = new SplitDetail(splitDetailTriggers[i]);
  instance.create();
}
