'use strict';

var extend = require('extend');

/**
 * Form Session Storage - Get
 */
function FormSessionStorageGet(element, config) {

  var options = {
  };

  extend(options, config);

  // Private variables
  var storedValue;

  /**
   * Set everything up
   */
  function create() {
    storedValue = sessionStorage.getItem(options.key);

    if(storedValue && !element.value) {
      element.value = storedValue;
    }
  }

  /**
   * Tear everything down again
   */
  function destroy() {
  }

  var self = {
    create: create,
    destroy: destroy
  };

  return self;

}

module.exports = FormSessionStorageGet;
