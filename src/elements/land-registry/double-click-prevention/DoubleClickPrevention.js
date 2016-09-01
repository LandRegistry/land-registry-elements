'use strict';

var extend = require('extend');

/**
 * Double click prevention
 */
function DoubleClickPrevention(element, config) {

  var options = {
    waitText: 'Please wait…',
    waitClass: 'button-waiting'
  };

  extend(options, config);

  // Private variables
  var originalText;

  /**
   * Set everything up
   */
  function create() {
    if(element.form.getAttribute('data-clientside-validation')) {

      window.PubSub.subscribe('clientside-form-validation.valid', function(msg, data) {
        disableButton()
      });

    } else {
      element.form.addEventListener('submit', disableButton);
    }

    if(element.value) {
      originalText = element.value;
    } else {
      originalText = element.textContent;
    }
  }

  /**
   * Main click event handler
   */
  function disableButton(){
    element.setAttribute('disabled', 'disabled');
    element.classList.add(options.waitClass)

    if(element.value) {
      element.value = options.waitText;
    } else {
      element.innerHTML = options.waitText;
    }
  }

  /**
   * Tear everything down again
   */
  function destroy() {
    element.form.removeEventListener('submit', disableButton);
    element.classList.remove(options.waitClass)
    element.removeAttribute('disabled');

    if(element.value) {
      element.value = originalText;
    } else {
      element.textContent = originalText;
    }
  }

  var self = {
    create: create,
    destroy: destroy
  };

  return self;

}

module.exports = DoubleClickPrevention;
