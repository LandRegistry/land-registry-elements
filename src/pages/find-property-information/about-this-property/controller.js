'use strict';

var PropertyMap = require('./PropertyMap');

var maps = document.querySelectorAll('[data-map-json]');
var instance;
var element;

for (var i = 0; i < maps.length; i++) {
  element = maps[i];

  var configID = element.getAttribute('data-map-json');
  var configElement = document.getElementById(configID);

  // If we can't find any config, bail out
  if(!configElement) {
    break;
  }

  var data = JSON.parse(configElement.innerHTML);

  var polygon = element.classList.contains('polygon');

  instance = new PropertyMap(element, {
    data: data,
    polygon: polygon,
    marker: !polygon
  });

  instance.create();
}
