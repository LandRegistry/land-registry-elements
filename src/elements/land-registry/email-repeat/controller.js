'use strict';

var EmailHint = require('./EmailHint');

var inputs = document.querySelectorAll('[data-email-hint]');
var instance;
var element;

for (var i = 0; i < inputs.length; i++) {
  element = inputs[i];
  instance = new EmailHint(element);
  instance.create();
}
