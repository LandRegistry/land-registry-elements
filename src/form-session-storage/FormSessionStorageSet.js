'use strict'

/**
 * Form Session Storage - Set
 */
function FormSessionStorageSet(element, config) {

  var options = {
  }

  $.extend(options, config)

  /**
   * Set everything up
   */
  function create() {
    // Bind keyup and change events to cope with text inputs as well as select boxes
    $(element).on('keyup', updateValue)
    $(element).on('change', updateValue)
  }

  /**
   * Update the value in the session storage
   */
  function updateValue(e) {
    sessionStorage.setItem(options.key, element.value)
  }

  /**
   * Tear everything down again
   */
  function destroy() {
    $(element).off('keyup', updateValue)
    $(element).off('change', updateValue)
    sessionStorage.removeItem(options.key)
  }

  var self = {
    create: create,
    destroy: destroy
  }

  return self

}

export { FormSessionStorageSet }
