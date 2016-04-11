var delegate = require('delegate');

var form = document.querySelector('.component-build-form');

if(form) {
  var checkboxes = form.querySelectorAll('input[type="checkbox"]');
  var buildUrl = form.querySelectorAll('.build-url');

  delegate(form, 'input[name^="components"]', 'change', change);

  function change() {
    // Get an array of all the components
    var values = [].map.call(checkboxes, function(el) {
      if(el.checked) {
        return el.id;
      } else {
        return false;
      }
    });

    // And filter out any that weren't checked
    values = values.filter(function(value) {
      return !!value;
    });

    // Build up a query string
    var queryString = '?';

    values.forEach(function(value, index) {
      queryString += 'components[' + index + ']=' + value + '&';
    });

    // And stick it in the input fields on the index page
    [].forEach.call(buildUrl, function(el) {
      el.value = window.location + 'build' + queryString;
    });
  }
}
