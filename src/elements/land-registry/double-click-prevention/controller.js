'use strict';

var DoubleClickPrevention = require('./DoubleClickPrevention');

var instance;
var element;

// Set
var buttons = document.querySelectorAll('[data-double-click-prevention]');
for (var i = 0; i < buttons.length; i++) {
  element = buttons[i];

  instance = new DoubleClickPrevention(element);
  instance.create();
}
