'use strict';

var FormSessionStorageSet = require('./FormSessionStorageSet');
var FormSessionStorageGet = require('./FormSessionStorageGet');

var instance;
var element;

// Set
var set_inputs = document.querySelectorAll('[data-session-storage-set]');
for (var i = 0; i < set_inputs.length; i++) {
  element = set_inputs[i];

  instance = new FormSessionStorageSet(element, {
    key: element.getAttribute('data-session-storage-set')
  });
  instance.create();
}

// Get
var get_inputs = document.querySelectorAll('[data-session-storage-get]');
for (var i = 0; i < get_inputs.length; i++) {
  element = get_inputs[i];

  instance = new FormSessionStorageGet(element, {
    key: element.getAttribute('data-session-storage-get')
  });
  instance.create();
}
