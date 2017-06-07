/* global $ */
'use strict'

import '../../utils/pub-sub/controller.js'

/**
 * Double click prevention
 */
function DoubleClickPrevention (element, config) {
  var options = {
    waitText: 'Please wait…',
    waitClass: 'button-waiting'
  }

  $.extend(options, config)

  // Private variables
  var originalText
  var enableSubscriber
  var disableSubscriber

  /**
   * Set everything up
   */
  function create () {
    if ($(element.form).attr('data-clientside-validation')) {
      window.PubSub.subscribe('clientside-form-validation.valid', function (msg, data) {
        disableButton()
      })
    } else {
      $(element.form).on('submit', disableButton)
    }

    if (element.value) {
      originalText = element.value
    } else {
      originalText = element.textContent
    }

    enableSubscriber = window.PubSub.subscribe('double-click-prevention.enable', function (msg, data) {
      if ($(data).is(element)) {
        enableButton()
      }
    })

    disableSubscriber = window.PubSub.subscribe('double-click-prevention.disable', function (msg, data) {
      if ($(data).is(element)) {
        disableButton()
      }
    })
  }

  /**
   * Main click event handler
   */
  function disableButton () {
    $(element).attr('disabled', 'disabled')
    $(element).addClass(options.waitClass)

    if (element.value) {
      element.value = options.waitText
    } else {
      element.innerHTML = options.waitText
    }
  }

  /**
   * Enable the button again
   */
  function enableButton () {
    $(element).removeClass(options.waitClass)
    $(element).removeAttr('disabled')

    if (element.value) {
      element.value = originalText
    } else {
      element.innerHTML = originalText
    }
  }

  /**
   * Tear everything down again
   */
  function destroy () {
    $(element.form).off('submit', disableButton)
    enableButton()
    window.PubSub.unsubscribe(enableSubscriber)
    window.PubSub.unsubscribe(disableSubscriber)
  }

  var self = {
    create: create,
    destroy: destroy
  }

  return self
}

export { DoubleClickPrevention }
