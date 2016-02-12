'use strict';

global.validate = require('validate.js'); // Expose validate as a global so that people can add custom validation routines easily
var extend = require('extend');
var domify = require('domify');
var closest = require('closest');
var delegate = require('delegate');

/**
 * Form validation
 * add a 5px red left border to the field with the error
 * show an error summary at the top of the page
 * move keyboard focus to the start of the summary
 * to move keyboard focus, put tabindex="-1" on the containing div and use obj.focus()
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
    message: 'The following errors were found:',
    description: false,

      // Note: Pre-compiled with hoganify browserify transform: @see https://www.npmjs.com/package/hoganify
    summaryTemplate: require('./clientside-templates/summary.hogan'),
    individualErrorTemplate: require('./clientside-templates/individualError.hogan'),

    // Form validation rules following the pattern
    rules: []
  };

  extend(options, config);

  // Private variables
  var validatorInstance;
  var errorSummary;

  /**
   * Set everything up
   */
  function create() {

    // Bail out if we don't have the proper element to act upon
    if (!element) {
      return;
    }

    // Bind form submit handler
    element.addEventListener('submit', submit);

    // Set up form field keyup handlers
    delegate(element, '.form-control', 'keyup', keyup);

  }

  /**
   * Main validation helper
   */
  function validateForm() {
    var errors = validate(element, options.rules, {
      fullMessages: true
    });

    var errorData = [];

    // Pre-process the errors to be suitable for hogan
    for(var key in errors) {
      if(errors.hasOwnProperty(key)) {
        errors[key].forEach(function(error) {
          errorData.push({
            'id': key,
            'message': error
          });
        });
      }
    }

    return errorData;
  }

  /**
   * Form submit handler
   */
  function submit(e) {

    var errorData = validateForm();

    if(errorData) {
      e.preventDefault();
    }

    if(options.showSummary) {
      showSummary(errorData);
    }

    if(options.showIndividualFormErrors) {
      showIndividualFormErrors(errorData);
    }

  }

  /**
   * Keyup handler
   */
  function keyup(e) {
    var errorData = validateForm();

    // We don't want to start flagging errors to the user until they have
    // at least attempted to enter a value into a field. This allows them to
    // tab around the form as much as they like to begin with and requried
    // fields will only be validated when they have entered something
    if(e.delegateTarget.value.length > 0) {
      e.delegateTarget.isDirty = true;
    }

    if(e.delegateTarget.isDirty && options.showIndividualFormErrors) {
      showIndividualFormErrors(errorData, e.delegateTarget);
    }
  }

  /**
   * Error summary
   */
  function showSummary(errors) {
    // Build up data to pass to the summary template
    var data = {
      'message': options.message,
      'description': options.description,
      'errors': errors
    };

    // Remove any previous error summary
    if(errorSummary && errorSummary.parentNode) {
      errorSummary.parentNode.removeChild(errorSummary);
    }

    if (errors.length > 0) {

      // Create an error summary
      errorSummary = domify(options.summaryTemplate.render(data));
      element.insertBefore(errorSummary, element.firstChild);

    }
  }

  /**
   * Individual form errors
   */
  function showIndividualFormErrors(errors, restrictTo) {

    // Remove any previous form element errors
    [].forEach.call(element.querySelectorAll('.error-message'), function(el) {

      if(restrictTo && el.previousSibling !== restrictTo) {
        return;
      }

      var formGroup = closest(el, '.form-group');
      formGroup.classList.remove('error');

      el.parentNode.removeChild(el);
    });

    if (errors.length > 0) {

      // Flag each element that has an error
      errors.forEach(function(error) {
        var target = document.getElementById(error.id);

        if(restrictTo && target !== restrictTo) {
          return;
        }

        var message = domify(options.individualErrorTemplate.render(error));
        target.parentNode.insertBefore(message, target.nextSibling);

        var formGroup = closest(target, '.form-group');
        formGroup.classList.add('error');
      })

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
  };

  return self;

}

module.exports = Validator;
