/* global $ */
'use strict'

import { Print } from './print'

$('[data-print]').each(function (index, item) {
  var instance = new Print(item)
  instance.create()
})
