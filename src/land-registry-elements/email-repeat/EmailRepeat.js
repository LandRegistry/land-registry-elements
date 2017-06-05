/* global $ */
'use strict'

/**
 * Email repeat
 */
function EmailRepeat (element, config) {
  var options = {}

  $.extend(options, config)

  // Private variables
  var hintWrapper
  var hint

  /**
   * Set everything up
   */
  function create () {
    // Bail out if we don't have the proper element to act upon
    if (!element) {
      return
    }

    hintWrapper = $('<div class="panel panel-border-narrow email-hint spacing-top-single"><p>Please ensure your email address is displayed correctly below. We will need this if you need to reset your password in future.</p><p class="bold email-hint-value"></p></div>')

    hint = $(hintWrapper).find('.email-hint-value')

    $(element).on('change', updateHint)
    $(element).on('keyup', updateHint)
  }

  /**
   *
   */
  function updateHint () {
    $(element).after(hintWrapper)

    // If the input field gets emptied out again, remove the hint
    if (element.value.length === 0) {
      hintWrapper.remove()
      return
    }

    // Update the hint to match the input value
    hint.text(element.value)
  }

  /**
   * Tear everything down again
   */
  function destroy () {
    hintWrapper.remove()

    $(element).off('change', updateHint)
    $(element).off('keyup', updateHint)
  }

  var self = {
    create: create,
    destroy: destroy
  }

  return self
}

export { EmailRepeat }
