'use strict';

require('validate-js');
var extend = require('extend');
var domify = require('domify');
var closest = require('closest');

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

    // Set up our form validator instance
    validatorInstance = new FormValidator(element, options.rules, errorHandler);

  }

  /**
   * Error handler
   */
  function errorHandler(errors, event) {

    if(options.showSummary) {
      showSummary(errors);
    }

    if(options.showIndividualFormErrors) {
      showIndividualFormErrors(errors);
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
  function showIndividualFormErrors(errors) {
    // Remove any previous form element errors
    [].forEach.call(element.querySelectorAll('.error-message'), function(el) {
      var formGroup = closest(el, '.form-group');
      formGroup.classList.remove('error');

      el.parentNode.removeChild(el);
    });

    if (errors.length > 0) {

      // Flag each element that has an error
      errors.forEach(function(error) {
        var target = document.getElementById(error.id);

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
