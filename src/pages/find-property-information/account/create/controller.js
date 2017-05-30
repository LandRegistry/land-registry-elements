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

  var letterMatches = value.match(/[A-Za-z]/g);
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

  var spaceMatches = value.match(/\s/g);
  if(value.length > 0 && Array.isArray(spaceMatches) && spaceMatches.length > 0) {
    messages.push('Password must not contain spaces');
  }

  if(attributes.email === value) {
    messages.push('Password should not be the same as your email address');
  }

  return messages;
};

/**
 * Postcode validator to cater for the specific postcode requirements
 * of the Find property information service
 */
global.validate.validators.find_property_information_postcode = function(value, options, key, attributes) {

  var parts = {
    '{fst}': 'ABCDEFGHIJKLMNOPRSTUWYZ',
    '{sec}': 'ABCDEFGHKLMNOPQRSTUVWXY',
    '{thd}': 'ABCDEFGHJKMNPRSTUVWXY',
    '{fth}': 'ABEHMNPRVWXY',
    '{inward}': 'ABDEFGHJLNPQRSTUWXYZ'
  }

  var rules = [
    '^[{fst}][1-9]\\d[{inward}][{inward}]$',
    '^[{fst}][1-9]\\d\\d[{inward}][{inward}]$',
    '^[{fst}][{sec}]\\d\\d[{inward}][{inward}]$',
    '^[{fst}][{sec}][1-9]\\d\\d[{inward}][{inward}]$',
    '^[{fst}][1-9][{thd}]\\d[{inward}][{inward}]$',
    '^[{fst}][{sec}][1-9][{fth}]\\d[{inward}][{inward}]$'
  ];

  var postcode_regexp = rules.join('|');

  for(var i in parts) {
    if(parts.hasOwnProperty(i)) {
      postcode_regexp = postcode_regexp.replace(new RegExp(i, 'g'), parts[i])
    }
  }

  postcode_regexp = new RegExp(postcode_regexp);

  // Postcode is required if GB is selected
  if(attributes.country === 'United Kingdom') {

    if(!value) {
      return 'Postcode is required';
    }

    if(!postcode_regexp.test(value.toUpperCase().replace(/\s/, ''))) {
      return 'Postcode is not a valid UK postcode';
    }
  } else {
    return;
  }
};

/**
 * Email validator to cater for the specific email requirements
 * of the Find property information service
 */
global.validate.validators.find_property_information_email = function(value, options, key, attributes) {

  var messages = [];

  if(!value) {
    return;
  }

  var exclusionMatches = value.match(/[\+]/g);
  if(Array.isArray(exclusionMatches) && exclusionMatches.length > 0) {
    messages.push('Email must not contain the + character');
  }

  return messages;
};