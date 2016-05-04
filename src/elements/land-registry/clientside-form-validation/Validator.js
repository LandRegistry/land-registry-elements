'use strict';

var validate = global.validate = require('validate.js'); // Expose validate as a global so that people can add custom validation routines easily
var extend = require('extend');
var domify = require('domify');
var closest = require('closest');
var delegate = require('delegate');

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

    // Set up form field handlers
    delegate(element, '.form-control', 'keyup', keyup);
    delegate(element, 'input[type="radio"]', 'change', boolChange);
    delegate(element, 'input[type="checkbox"]', 'change', boolChange);
    delegate(element, '.form-control', 'focusout', focusout);

    // Summary click handlers
    delegate(element, '.error-summary-list a', 'click', summaryClick);

  }

  /**
   * Main validation helper
   */
  function validateForm() {
    var errors = validate(element, options.rules, {
      fullMessages: false
    });

    var errorData = [];

    // Pre-process the errors to be suitable for hogan
    for(var key in errors) {
      if(errors.hasOwnProperty(key)) {
        errors[key].forEach(function(error) {
          errorData.push({
            'name': key,
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

    if(errorData.length > 0) {
      e.preventDefault();
    }

    showSummary(errorData);

    if(options.showIndividualFormErrors) {
      showIndividualFormErrors(errorData);
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
    if(e.delegateTarget.value.length > 0) {
      e.delegateTarget.isDirty = true;
    }
  }

  /**
   * focusout handler
   */
  function focusout(e) {
    var errorData = validateForm();

    if(e.delegateTarget.isDirty && options.showIndividualFormErrors) {
      showIndividualFormErrors(errorData, e.delegateTarget);
    }
  }

  /**
   * radio / checkbox change
   */
  function boolChange(e) {
    var errorData = validateForm();

    if(options.showIndividualFormErrors) {
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

      if(!options.showSummary) {
        errorSummary.classList.add('visuallyhidden');
      }

      element.insertBefore(errorSummary, element.firstChild);

      // Place focus on the summary
      errorSummary.focus();

    }
  }

  /**
   * Individual form errors
   */
  function showIndividualFormErrors(errors, restrictTo) {

    // Remove any previous form element errors
    [].forEach.call(element.querySelectorAll('.form-group'), function(formGroup) {
      var target = formGroup.querySelector('.form-control');

      if(!target) {
        return;
      }

      if(restrictTo && target.getAttribute('name') !== restrictTo.getAttribute('name')) {
        return;
      }

      formGroup.classList.remove('error');

      target.removeAttribute('aria-describedby');

      var errorMessage = formGroup.querySelector('.error-message');

      if(errorMessage) {
        errorMessage.parentNode.removeChild(errorMessage);
      }
    });

    if (errors.length > 0) {

      // Flag each element that has an error
      errors.forEach(function(error) {
        var target = document.querySelectorAll('[name="' + error.name + '"]')[0];

        if(!target) {
          return;
        }

        if(restrictTo && target !== restrictTo) {
          return;
        }

        var message = domify(options.individualErrorTemplate.render(error));
        closest(target, '.form-group').insertBefore(message, target.nextSibling);

        var formGroup = closest(target, '.form-group');
        formGroup.classList.add('error');

        // Link the form field to the error message with an aria attribute
        target.setAttribute('aria-describedby', 'error-message-' + error.name);
      })

    }
  }

  /**
   * Click handler for summary items
   */
  function summaryClick(e) {
    e.preventDefault();

    var target = document.querySelectorAll('[name="' + e.delegateTarget.getAttribute('data-target') + '"]')[0];
    target.focus();
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
