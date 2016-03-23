'use strict';

var extend = require('extend');

/**
 * Back links
 */
function BackLink(element, config) {

  var options = {};

  extend(options, config);

  // Private variables

  /**
   * Set everything up
   */
  function create() {

    // Bail out if we don't have the proper element to act upon
    if (!element) {
      return;
    }

    element.addEventListener('click', goBack);
  }

  function goBack(e) {
    e.preventDefault();
    window.history.go(-1);
  }

  /**
   * Tear everything down again
   */
  function destroy() {
    element.removeEventListener('click', goBack);
  }

  var self = {
    create: create,
    destroy: destroy
  };

  return self;

}

module.exports = BackLink;
