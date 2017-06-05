/* global $ */
'use strict'

import { FormSessionStorageSet } from './FormSessionStorageSet'
import { FormSessionStorageGet } from './FormSessionStorageGet'

// Set
$('[data-session-storage-set]').each(function (index, item) {
  var instance = new FormSessionStorageSet(item, {
    key: $(item).attr('data-session-storage-set')
  })
  instance.create()
})

// Get
$('[data-session-storage-get]').each(function (index, item) {
  var instance = new FormSessionStorageGet(item, {
    key: $(item).attr('data-session-storage-get')
  })
  instance.create()
})
