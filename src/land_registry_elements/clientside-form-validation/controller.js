/* global $ */
'use strict'

var Validator = require('./Validator')

$('[data-clientside-validation]').each(function (index, item) {
  var rules
  var instance

  // Slurp the form validator config from the associated script tag in the DOM
  var configID = item.getAttribute('data-clientside-validation')

  var configElement = document.getElementById(configID)
  // If we can't find any config, bail out
  if (!configElement) {
    return
  }

  rules = $.parseJSON(configElement.innerHTML)

  instance = new Validator(item, {
    'rules': rules,
    'showSummary': !$(item).is('[data-clientside-validation-no-summary]')
  })

  instance.create()
})
