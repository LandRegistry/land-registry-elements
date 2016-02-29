var Remarkable = require('remarkable');
var md = new Remarkable();

module.exports = function(handlebars) {
  return function(options) {
    var contents = options.fn(this);

    return new handlebars.SafeString(md.render(contents));
  }
};
