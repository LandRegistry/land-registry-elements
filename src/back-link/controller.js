'use strict';

var BackLink = require('./BackLink');

var links = document.querySelectorAll('[data-back-link]');
var instance;

for (var i = 0; i < links.length; i++) {
  instance = new BackLink(links[i]);

  instance.create();
}
