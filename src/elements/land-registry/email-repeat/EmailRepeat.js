'use strict';

var extend = require('extend');
var domify = require('domify');

/**
 * Email hint
 */
function EmailHint(element, config) {

  var options = {
    hintTemplate: require('./clientside-templates/email-hint.hogan')
  };

  extend(options, config);

  // Private variables
  var hintWrapper;
  var hint;

  /**
   * Set everything up
   */
  function create() {

    // Bail out if we don't have the proper element to act upon
    if (!element) {
      return;
    }

    hintWrapper = domify(options.hintTemplate.render());

    hint = hintWrapper.querySelector('.email-hint-value');

    element.addEventListener('change', updateHint);
    element.addEventListener('keyup', updateHint);
  }

  /**
   *
   */
  function updateHint() {
    // If the hint isn't already in the dom, pop it in
    if(!hintWrapper.parentNode) {
      element.parentNode.insertBefore(hintWrapper, element.nextSibling);
    }

    // If the input field gets emptied out again, remove the hint
    if(element.value.length === 0) {
      hintWrapper.parentNode.removeChild(hintWrapper);
    }

    // Update the hint to match the input value
    hint.textContent = element.value;
  }

  /**
   * Tear everything down again
   */
  function destroy() {
    if(hintWrapper.parentNode) {
      hintWrapper.parentNode.removeChild(hintWrapper);
    }

    element.addEventListener('change', updateHint);
    element.addEventListener('keyup', updateHint);
  }

  var self = {
    create: create,
    destroy: destroy
  };

  return self;

}

module.exports = EmailHint;
