'use strict';

import { DoubleClickPrevention } from './DoubleClickPrevention.js'

$('[data-double-click-prevention]').each(function(index, item) {
  var instance = new DoubleClickPrevention(item)
  instance.create()
})
