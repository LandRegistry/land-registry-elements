'use strict'

var validate = require('validate.js')
require('../pub-sub/controller.js')

/**
 * Form validation
 * Outline spec from govuk
 * add a 5px red left border to the field with the error
 * show an error summary at the top of the page
 * move keyboard focus to the start of the summary
 * indicate to screenreaders that the summary represents a collection of information
 * add the ARIA role="group" to the containing div
 * use a heading at the top of the summary
 * associate the heading with the summary box
 * use the ARIA attribute aria-labelledby on the containing div, so that screen readers will automatically announce the heading as soon as focus is moved to the div
 * link from the error list in the summary to the fields with errors
 * show an error message before each field with an error
 * associate each error message with the corresponding field
 * add an ID to each error message and associate this with the field using aria-describedby
 */
function Validator(element, config) {

  var options = {
    showSummary: true,
    showIndividualFormErrors: true,
    headingMessage: 'The following errors were found:',
    description: false,

    controlSelector: '.form-control, input[type="checkbox"], input[type="radio"]',

    // Form validation rules following the pattern
    rules: []
  }

  $.extend(options, config)

  // Private variables
  var $element
  var errorSummary
  var serversideErrors = []

  /**
   * Set everything up
   */
  function create() {

    // Bail out if we don't have the proper element to act upon
    if (!element) {
      return
    }

    $element = $(element)

    // Bind form submit handler
    $element.on('submit', submit)

    // Set up form field handlers
    $element.on('keyup', '.form-control', keyup)
    $element.on('change', 'select', change)
    $element.on('change', 'input[type="radio"]', change)
    $element.on('change', 'input[type="checkbox"]', change)
    $element.on('focusout', '.form-control', focusout)

    // Summary click handlers
    $element.on('.error-summary-list a', 'click', summaryClick)

    // Grab any existing error messages and ensure they persist, regardless of clientside changes
    var $existingSummary = $element.find('.error-summary')
    if($existingSummary) {
      $existingSummary.find('.error-summary-list li')
        .each(function(index, item) {
          serversideErrors.push(item.innerHTML)
        })

      options.showSummary = true
      $existingSummary.remove()
      showSummary({})
    }

  }

  /**
   * Main validation helper
   */
  function validateForm() {
    var errors = validate(element, options.rules, {
      fullMessages: false
    })

    var errorData = []

    // Turn the errors into an array to make it easier to use elsewhere
    for(var key in errors) {
      if(errors.hasOwnProperty(key)) {
        errors[key].forEach(function(error) {
          errorData.push({
            'name': key,
            'message': error
          })
        })
      }
    }

    return errorData
  }

  /**
   * Form submit handler
   */
  function submit(e) {

    var errorData = validateForm()

    if(errorData.length > 0) {
      e.preventDefault()
      window.PubSub.publish('clientside-form-validation.invalid', element)
    } else {
      window.PubSub.publish('clientside-form-validation.valid', element)
    }

    showSummary(errorData)

    if(options.showIndividualFormErrors) {
      showIndividualFormErrors(errorData)
    }

  }

  /**
   * Keyup handler
   */
  function keyup(e) {
    // We don't want to start flagging errors to the user until they have
    // at least attempted to enter a value into a field. This allows them to
    // tab around the form as much as they like to begin with and requried
    // fields will only be validated when they have entered something
    if(e.currentTarget.value.length > 0) {
      e.currentTarget.isDirty = true
    }
  }

  /**
   * focusout handler
   */
  function focusout(e) {

    var errorData = validateForm()

    if(e.currentTarget.isDirty && options.showIndividualFormErrors) {
      showIndividualFormErrors(errorData, e.currentTarget)
    }

  }

  /**
   * radio / checkbox change
   */
  function change(e) {

    var errorData = validateForm()

    if(options.showIndividualFormErrors) {
      showIndividualFormErrors(errorData, e.target)
    }

  }

  function renderSummary(data) {

    var summary = $('<div class="error-summary" role="group" aria-labelledby="error-summary-heading" tabindex="-1"></div>')

    if(data.headingMessage) {
      summary.append('<h2 class="heading-medium error-summary-heading" id="error-summary-heading">' + data.headingMessage + '</h2>')
    }

    if(data.description) {
      summary.append('<p>' + data.description + '</p>')
    }

    var errorList = $('<ul class="error-summary-list"></ul>')

    $.each(data.errors, function(index, item) {
      errorList.append('<li><a href="#" data-target="' + item.name + '">' + item.message + '</a></li>')
    })

    $.each(data.serversideErrors, function(index, item) {
      errorList.append('<li>' + item + '</li>')
    })

    summary.append(errorList)

    return summary
  }

  /**
   * Error summary
   */
  function showSummary(errors) {
    // Build up data to pass to the summary template
    var data = {
      'headingMessage': options.headingMessage,
      'description': options.description,
      'errors': errors,
      'serversideErrors': serversideErrors
    }

    // Remove any previous error summary
    $(errorSummary).remove()

    if (data.errors.length > 0 || serversideErrors.length > 0) {

      // Create an error summary
      errorSummary = renderSummary(data)

      if(!options.showSummary) {
        errorSummary.addClass('visuallyhidden')
      }

      $element.prepend(errorSummary)
    }

    if(data.errors.length > 0) {
      // Place focus on the summary
      errorSummary.focus()
    }
  }

  /**
   * Individual form errors
   */
  function showIndividualFormErrors(errors, restrictTo) {

    // Remove any previous form element errors
    $element.find('.form-group').each(function(index, formGroup) {
      var target = $(formGroup).find(options.controlSelector)

      if(restrictTo && $(target).attr('name') !== $(restrictTo).attr('name')) {
        return
      }

      $(formGroup).removeClass('form-group-error')

      if(target) {
        target.removeAttr('aria-describedby')
      }

      $(formGroup).find('.error-message').remove()
    })

    if (errors.length > 0) {

      // Flag each element that has an error
      errors.forEach(function(error) {
        var target = $('[name="' + error.name + '"]')

        if(!target) {
          return
        }

        if(restrictTo && !target.is(restrictTo)) {
          return
        }

        var message = $('<span role="alert" class="error-message" id="error-message-' + error.name + '">' + error.message + '</span>')

        var formGroup = $(target).closest('.form-group')

        // If the element is a direct child of the form group, insert the error after it
        if($(target).parent().is(formGroup)) {
          target.before(message)
        } else if($(target).closest('.form-group').find('legend.form-label, legend.form-label-bold').length) {
          $(target).closest('.form-group').find('legend.form-label, legend.form-label-bold').first().append(message)
        } else {
          // Otherwise insert it at the start of the form group
          formGroup.prepend(message)
        }

        formGroup.addClass('form-group-error')

        // Link the form field to the error message with an aria attribute
        target.attr('aria-describedby', 'error-message-' + error.name)
      })

    }
  }

  /**
   * Click handler for summary items
   */
  function summaryClick(e) {
    var dataTarget = $(e.currentTarget).attr('data-target')

    if(dataTarget) {
      e.preventDefault()

      var target = $('[name="' + dataTarget + '"]')[0]
      target.focus()
    }
  }

  /**
   * Tear everything down again
   */
  function destroy() {

  }

  var self = {
    create: create,
    destroy: destroy
  }

  return self

}

module.exports = Validator
