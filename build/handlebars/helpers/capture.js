  /**
   * Block helper to set a value on the current context to the contents of the
   * block. For example:
   * {{#capture 'someName'}}Some value{{/capture}}
   *
   * becomes this.someName on the current context and can be used like this:
   *
   * <p>{{someName}}</p>
   *
   * which renders as:
   *
   * <p>Some value</p>
   */
module.exports = function(handlebars) {
  return function(key, options) {
    this[key] = options.fn(this);
  };
};

