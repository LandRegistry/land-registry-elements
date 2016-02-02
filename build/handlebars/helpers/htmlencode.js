var htmlEncode = require('js-htmlencode').htmlEncode;

module.exports = function(handlebars) {
  return function(options) {
    var contents = options.fn(this);
    return new handlebars.SafeString(htmlEncode(contents));
  }
};
