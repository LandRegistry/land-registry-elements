/* global $ */
'use strict'

import { BackLink } from './BackLink.js'

$('[data-back-link]').each(function (index, item) {
  var instance = new BackLink(item)
  instance.create()
})
