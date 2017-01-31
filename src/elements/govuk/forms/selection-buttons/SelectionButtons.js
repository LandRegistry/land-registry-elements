var closest = require('closest');
var extend = require('extend');

function SelectionButtons(element, config) {

  var options = {
    selectedClass: 'selected',
    focusedClass: 'focused',
    radioClass: 'selection-button-radio',
    checkboxClass: 'selection-button-checkbox'
  };

  extend(options, config);

  // Private variables
  var label;
  var form;

  /**
   * Set everything up
   */
  function create() {

    // Bail out if we don't have the proper element to act upon
    if (!element) {
      return;
    }

    label = closest(element, 'label');
    form = closest(element, 'form');

    var labelClass = (element.type === 'radio') ? options.radioClass : options.checkboxClass;
    label.classList.add(labelClass);

    if(element.checked) {
      markSelected();
    }

    element.addEventListener('click', clickHandler);
    element.addEventListener('focus', focusHandler);
    element.addEventListener('blur', focusHandler);
  }

  function markFocused(state) {
    if (state === 'focused') {
      label.classList.add(options.focusedClass);
    } else {
      label.classList.remove(options.focusedClass);
    }
  }

  function markSelected() {
    var radioName;

    if(element.type === 'radio') {
      radioName = element.name;

      var radioGroup = form.querySelectorAll('input[name="' + radioName + '"]');

      [].forEach.call(radioGroup, function(radio) {
        closest(radio, 'label').classList.remove(options.selectedClass);
      });

      label.classList.add(options.selectedClass);

    } else { // checkbox
      if (element.checked) {
        label.classList.add(options.selectedClass);
      } else {
        label.classList.remove(options.selectedClass);
      }
    }
  }

  function clickHandler() {
    markSelected();
  }

  function focusHandler(e) {
    var state = (e.type === 'focus') ? 'focused' : 'blurred';

    markFocused(state);
  }

  /**
   * Tear everything down again
   */
  function destroy() {
    element.removeEventListener('click', clickHandler);
    element.removeEventListener('focus', focusHandler);
    element.removeEventListener('blur', focusHandler);
  }

  var self = {
    create: create,
    destroy: destroy
  };

  return self;

}

module.exports = SelectionButtons;
