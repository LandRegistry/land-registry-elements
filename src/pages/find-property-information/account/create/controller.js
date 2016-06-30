/**
 * Password validator to cater for the specific password requirements
 * of the Find property information service
 */
global.validate.validators.find_property_information_password = function(value, options, key, attributes) {

  var messages = [];

  if(!value) {
    return;
  }

  value = value.toString();

  var letterMatches = value.match(/[A-za-z]/g);
  if(!Array.isArray(letterMatches) || letterMatches.length < 1) {
    messages.push('Password must contain at least 1 letter');
  }

  var numberMatches = value.match(/\d/g);
  if(!Array.isArray(numberMatches) || numberMatches.length < 2) {
    messages.push('Password must contain at least 2 numbers');
  }

  var exclusionMatches = value.match(/[£\u20AC\u00AC\u00A6]/g);
  if(Array.isArray(exclusionMatches) && exclusionMatches.length > 0) {
    messages.push('Password must not contain the characters &pound; &#x20AC; &#x00AC; &#x00A6;');
  }

  if(attributes.username === value) {
    messages.push('Password should not be the same as your email address');
  }

  return messages;
};

/**
 * Postcode validator to cater for the specific postcode requirements
 * of the Find property information service
 */
global.validate.validators.find_property_information_postcode = function(value, options, key, attributes) {
  // Postcode is required if GB is selected
  if(attributes.country === 'GB') {
    return 'Postcode is required';
  } else {
    return;
  }
};
