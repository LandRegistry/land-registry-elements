var closest = require('closest');
var extend = require('extend');

function ShowHideContent(element, config) {

  var options = {
  };

  extend(options, config);

  // Private variables
  var label;
  var target;

  /**
   * Set everything up
   */
  function create() {

    // Bail out if we don't have the proper element to act upon
    if (!element) {
      return;
    }

    label = closest(element, 'label');

    var targetSelector = label.getAttribute('data-target');
    if (targetSelector) {
      target = document.getElementById(targetSelector);
      target.setAttribute('aria-hidden', 'true');
      element.setAttribute('aria-controls', targetSelector);
      element.setAttribute('aria-expanded', 'false');
    }

    element.addEventListener('click', click);
  }

  function click(e) {
    var state = element.getAttribute('aria-expanded') === 'false' ? true : false;

    // If we're talking radio buttons, then hide all other conditional content in the group
    if(element.type === 'radio') {
      // Select radio buttons in the same group
      var radioGroup = closest(element, 'form').querySelectorAll('.block-label input[name="' + element.name + '"]');

      [].forEach.call(radioGroup, function(radio) {

        var groupDataTargetId = closest(radio, 'label').getAttribute('data-target');
        var groupDataTarget = document.getElementById(groupDataTargetId);

        if(groupDataTarget) {
          groupDataTarget.classList.add('js-hidden');

          // Set aria-expanded and aria-hidden for hidden content
          groupDataTarget.setAttribute('aria-expanded', 'false');
          groupDataTarget.setAttribute('aria-hidden', 'true');
        }
      });
    }

    // Toggle hidden content
    if(target) {
      target.classList.toggle('js-hidden')

      // Update aria-expanded and aria-hidden attributes
      element.setAttribute('aria-expanded', state);
      target.setAttribute('aria-hidden', !state);
    }
  }

  /**
   * Tear everything down again
   */
  function destroy() {
    element.removeEventListener('click', click);
  }

  var self = {
    create: create,
    destroy: destroy
  };

  return self;

}

module.exports = ShowHideContent;
