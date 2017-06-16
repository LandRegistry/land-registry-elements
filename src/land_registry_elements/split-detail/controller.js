/* global $ */
'use strict'

import { SplitDetail } from './SplitDetail'

$('.split-detail-trigger').each(function (index, item) {
  var instance = new SplitDetail(item)
  instance.create()
})
