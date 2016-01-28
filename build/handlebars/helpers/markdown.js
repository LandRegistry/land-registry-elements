var markdown = require('markdown').markdown;

module.exports = function(handlebars) {
  return function(options) {
    var contents = options.fn(this);

    return new handlebars.SafeString(markdown.toHTML(contents));
  }
};
