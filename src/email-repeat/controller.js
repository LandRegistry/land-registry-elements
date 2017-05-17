'use strict';

import { EmailRepeat} from './EmailRepeat';

$('[data-email-hint]').each(function(index, item) {
  var instance = new EmailRepeat(item);
  instance.create();
})
