'use strict';

require('classlist-polyfill');
var Validator = require('./Validator');

var forms = document.querySelectorAll('[data-clientside-validation]');
var rules;
var instance;
var element;

// IE8 doesn't get clientside validation as it validatejs does not support it
if(!document.documentElement.classList.contains('lte-ie8')) {

  for (var i = 0; i < forms.length; i++) {
    element = forms[i];

    // Slurp the form validator config from the associated script tag in the DOM
    var configID = element.getAttribute('data-clientside-validation');

    var configElement = document.getElementById(configID);

    // If we can't find any config, bail out
    if(!configElement) {
      break;
    }

    rules = JSON.parse(configElement.textContent);

    instance = new Validator(element, {
      'rules': rules,
      'showSummary': !element.hasAttribute('data-clientside-validation-no-summary')
    });

    instance.create();
  }

}
