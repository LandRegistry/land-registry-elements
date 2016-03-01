'use strict';

var extend = require('extend');

/**
 * Split detail
 */
function SplitDetail(element, config) {

  var options = {
    contentsActiveClass: 'split-detail-contents-active',
    triggerActiveClass: 'split-detail-trigger-active'
  };

  extend(options, config);

  // Private variables
  var target;

  /**
   * Set everything up
   */
  function create() {

    // Bail out if we don't have the proper element to act upon
    if (!element) {
      return;
    }

    // Find the target of the link
    target = document.querySelector(element.getAttribute('href'));

    // Bind click handler to the main trigger
    element.addEventListener('click', triggerClick);
  }

  /**
   * Main event handler for the trigger click
   * @param  {Event} e
   */
  function triggerClick(e) {
    e.preventDefault();
    element.classList.toggle(options.triggerActiveClass);
    target.classList.toggle(options.contentsActiveClass);
  }

  /**
   * Tear everything down again
   */
  function destroy() {
    element.removeEventListener('click', triggerClick);
    element.classList.remove(options.triggerActiveClass);
    target.classList.remove(options.contentsActiveClass);
  }

  var self = {
    create: create,
    destroy: destroy
  };

  return self;

}

module.exports = SplitDetail;
