'use strict';

var PasswordReveal = require('./PasswordReveal');

var inputs = document.querySelectorAll('[data-password-reveal]');
var instance;
var element;

for (var i = 0; i < inputs.length; i++) {
  element = inputs[i];
  instance = new PasswordReveal(element);
  instance.create();
}
