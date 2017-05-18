/* global $ */
'use strict'

/**
 * Split detail
 */
function SplitDetail (element, config) {
  var options = {
    contentsActiveClass: 'split-detail-contents-active',
    triggerActiveClass: 'split-detail-trigger-active'
  }

  $.extend(options, config)

  // Private variables
  var target

  /**
   * Set everything up
   */
  function create () {
    // Bail out if we don't have the proper element to act upon
    if (!element) {
      return
    }

    // Find the target of the link
    target = $($(element).attr('href'))

    // Bind click handler to the main trigger
    $(element).on('click', triggerClick)
  }

  /**
   * Main event handler for the trigger click
   * @param  {Event} e
   */
  function triggerClick (e) {
    e.preventDefault()
    $(element).toggleClass(options.triggerActiveClass)
    $(target).toggleClass(options.contentsActiveClass)
  }

  /**
   * Tear everything down again
   */
  function destroy () {
    $(element).off('click', triggerClick)
    $(element).removeClass(options.triggerActiveClass)
    $(target).removeClass(options.contentsActiveClass)
  }

  var self = {
    create: create,
    destroy: destroy
  }

  return self
}

export { SplitDetail }
