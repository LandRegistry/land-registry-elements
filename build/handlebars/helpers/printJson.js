module.exports = function(handlebars) {
  return function(data, options) {
    return JSON.stringify(data);
  };
};

