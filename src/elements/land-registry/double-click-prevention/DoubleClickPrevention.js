'use strict';

var extend = require('extend');

/**
 * Double click prevention
 */
function DoubleClickPrevention(element, config) {

  var options = {
  };

  extend(options, config);

  /**
   * Set everything up
   */
  function create() {
    element.form.addEventListener('submit', disableButton);
  }

  /**
   * Main click event handler
   */
  function disableButton(e){
    element.setAttribute('disabled', 'disabled');
  }

  /**
   * Tear everything down again
   */
  function destroy() {
    element.form.removeEventListener('submit', disableButton);
    element.removeAttribute('disabled');
  }

  var self = {
    create: create,
    destroy: destroy
  };

  return self;

}

module.exports = DoubleClickPrevention;
