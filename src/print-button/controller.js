'use strict';

var Print = require('./print');

var printButtons = document.querySelectorAll('[data-print]');
var instance;

for (var i = 0; i < printButtons.length; i++) {
  instance = new Print(printButtons[i]);
  instance.create();
}
