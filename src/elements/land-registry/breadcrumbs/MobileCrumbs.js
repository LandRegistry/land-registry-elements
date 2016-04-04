'use strict';

var extend = require('extend');

/**
 * Mobile crumbtrail behaviour
 */
function MobileCrumbs(element, config) {

  var options = {
    leftClass: 'breadcrumbs-at-left',
    rightClass: 'breadcrumbs-at-right',
    enabledClass: 'breadcrumbs-mobile-scrolling-enabled',
    debounceDelay: 150
  };

  extend(options, config);

  // Private variables
  var scrollTimeout = null;
  var resizeTimeout = null;

  /**
   * Set everything up
   */
  function create() {

    // Bail out if we don't have the proper element to act upon
    if (!element) {
      return;
    }

    // element.classList.add(options.enabledClass);

    // Scroll the crumbtrail all the way to the right by default
    element.scrollLeft = element.clientWidth;

    element.addEventListener('scroll', scrollListener);
    window.addEventListener('load', calc);

    window.addEventListener('resize', resizeListener);

  }

  /**
   * Main scroll event listener
   * @param  {Event} e
   */
  function scrollListener() {
    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(function() {
      calc();
    }, options.debounceDelay);
  }

  /**
   * Window resize listener
   * Used to "stick" the crumbtrail to the right hand side
   * @param  {Event} e
   */
  function resizeListener() {
    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(function() {
      element.scrollLeft = element.clientWidth;

      calc();
    }, options.debounceDelay);
  }

  /**
   * Main calculation handler
   * Called on scroll (debounced) and on window load
   */
  function calc() {

    // If we're too narrow to need peepage
    if(element.clientWidth >= element.scrollWidth) {
      element.classList.remove(options.leftClass);
      element.classList.remove(options.rightClass);
      element.classList.remove(options.enabledClass);

      return;
    }

    // Otherwise, enable the peepage
    element.classList.add(options.enabledClass);

    // If we're at the end
    if(element.scrollLeft === element.scrollWidth - element.offsetWidth) {
      element.classList.add(options.rightClass);
      element.classList.remove(options.leftClass);
    }

    // If we're at the start
    else if(element.scrollLeft === 0) {
      element.classList.add(options.leftClass);
      element.classList.remove(options.rightClass);

    }

    // Otherwise we're somewhere in between
    else {
      element.classList.remove(options.leftClass);
      element.classList.remove(options.rightClass);
    }
  }

  /**
   * Tear everything down again
   */
  function destroy() {
    // Unbind any queued listeners
    clearTimeout(resizeTimeout);
    clearTimeout(scrollTimeout);

    // Unbind events
    element.removeEventListener('scroll', scrollListener);
    window.removeEventListener('load', calc);
    window.removeEventListener('resize', calc);

    // Remove all classes
    element.classList.remove(options.leftClass);
    element.classList.remove(options.rightClass);
    element.classList.remove(options.enabledClass);
  }

  var self = {
    create: create,
    destroy: destroy
  };

  return self;

}

module.exports = MobileCrumbs;
