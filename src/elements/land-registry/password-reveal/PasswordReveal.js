'use strict';

var extend = require('extend');
var domify = require('domify');

/**
 * Password Reveal
 */
function PasswordReveal(element, config) {

  var options = {
    toggleLabel: 'Show typing',
    checkboxTemplate: require('./clientside-templates/checkbox.hogan'),
  };

  extend(options, config);

  // Private variables
  var checkbox;

  /**
   * Set everything up
   */
  function create() {

    // Bail out if we don't have the proper element to act upon
    if (!element) {
      return;
    }

    // Create our checkbox to toggle the display
    checkbox = domify(options.checkboxTemplate.render({
      label: options.toggleLabel,
      target: element.name
    }));

    // Bind click event to the checkbox
    checkbox.querySelector('input').addEventListener('click', toggle);

    // Pop the checkbox in the dom
    element.parentNode.insertBefore(checkbox, element.nextSibling);
  }

  /**
   * Main toggle event handler
   */
  function toggle(e) {
    if(element.type === 'password') {
      element.type = 'text';
    } else {
      element.type = 'password';
    }
  }

  /**
   * Tear everything down again
   */
  function destroy() {
    checkbox.removeEventListener('click', toggle);
    checkbox.parentNode.removeChild(checkbox);
    element.type = 'password';
  }

  var self = {
    create: create,
    destroy: destroy
  };

  return self;

}

module.exports = PasswordReveal;
