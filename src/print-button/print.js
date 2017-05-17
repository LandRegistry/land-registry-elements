'use strict'

/**
 * Print buttons
 */
function Print(element, config) {

  var options = {}

  $.extend(options, config)

  /**
   * Set everything up
   */
  function create() {

    // Bail out if we don't have the proper element to act upon
    if (!element) {
      return
    }

    $(element).on('click', click)
  }

  /**
   * Main click event handler
   * @param  {Event} e
   */
  function click(e) {
    e.preventDefault()

    window.print()
  }

  /**
   * Tear everything down again
   */
  function destroy() {
    $(element).off('click', click)
  }

  var self = {
    create: create,
    destroy: destroy
  }

  return self

}

export { Print }
