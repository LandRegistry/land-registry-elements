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

    element.addEventListener('keyup', updateHint);
  }

  /**
   *
   */
  function updateHint() {
    console.log(element);


    if(!hintWrapper.parentNode) {
      element.parentNode.insertBefore(hintWrapper, element.nextSibling);
    }

    if(element.value.length === 0) {
      hintWrapper.parentNode.removeChild(hintWrapper);
    }

    hint.textContent = element.value;
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

module.exports = EmailHint;
