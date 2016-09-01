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
    headingMessage: 'The following errors were found:',
    description: false,

    controlSelector: '.form-control, input[type="checkbox"], input[type="radio"]',

    // Note: Pre-compiled with hoganify browserify transform: @see https://www.npmjs.com/package/hoganify
    summaryTemplate: require('./clientside-templates/summary.hogan'),
    individualErrorTemplate: require('./clientside-templates/individualError.hogan'),

    // Form validation rules following the pattern
    rules: []
  };

  extend(options, config);

  // Private variables
  var errorSummary;
  var serversideErrors = [];

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
    delegate(element, 'select', 'change', change);
    delegate(element, 'input[type="radio"]', 'change', change);
    delegate(element, 'input[type="checkbox"]', 'change', change);
    delegate(element, '.form-control', 'focusout', focusout);

    // Summary click handlers
    delegate(element, '.error-summary-list a', 'click', summaryClick);

    // Grab any existing error messages and ensure they persist, regardless of clientside changes
    var existingSummary = element.querySelector('.error-summary');
    if(existingSummary) {
      var existingErrors = existingSummary.querySelectorAll('.error-summary-list li');
      for (var i = 0; i < existingErrors.length; i++) {
        serversideErrors.push(existingErrors[i].innerHTML);
      }

      options.showSummary = true;
      existingSummary.parentNode.removeChild(existingSummary);
      showSummary({});
    }

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
      PubSub.publish('clientside-form-validation.invalid', element);
    } else {
      PubSub.publish('clientside-form-validation.valid', element);
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
  function change(e) {

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
      'headingMessage': options.headingMessage,
      'description': options.description,
      'errors': errors,
      'serversideErrors': serversideErrors
    };

    // Remove any previous error summary
    if(errorSummary && errorSummary.parentNode) {
      errorSummary.parentNode.removeChild(errorSummary);
    }

    if (data.errors.length > 0 || serversideErrors.length > 0) {

      // Create an error summary
      errorSummary = domify(options.summaryTemplate.render(data));

      if(!options.showSummary) {
        errorSummary.classList.add('visuallyhidden');
      }

      element.insertBefore(errorSummary, element.firstChild);
    }

    if(data.errors.length > 0) {
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
      var target = formGroup.querySelector(options.controlSelector);

      if(restrictTo && target.getAttribute('name') !== restrictTo.getAttribute('name')) {
        return;
      }

      formGroup.classList.remove('error');

      if(target) {
        target.removeAttribute('aria-describedby');
      }

      var errorMessages = formGroup.querySelectorAll('.error-message');
      [].forEach.call(errorMessages, function(errorMessage) {
        if(errorMessage.parentNode) {
          errorMessage.parentNode.removeChild(errorMessage);
        }
      });

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

        var formGroup = closest(target, '.form-group');

        // If the element is a direct child of the form group, insert the error after it
        if(target.parentNode === formGroup) {
          formGroup.insertBefore(message, target.nextSibling);
        } else {
          // Otherwise insert it at the end of the form group
          formGroup.appendChild(message);
        }

        formGroup.classList.add('error');

        // Link the form field to the error message with an aria attribute
        target.setAttribute('aria-describedby', 'error-message-' + error.name);
      });

    }
  }

  /**
   * Click handler for summary items
   */
  function summaryClick(e) {
    var dataTarget = e.delegateTarget.getAttribute('data-target');

    if(dataTarget) {
      e.preventDefault();

      var target = document.querySelectorAll('[name="' + dataTarget + '"]')[0];
      target.focus();
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
