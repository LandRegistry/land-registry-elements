var handlebars = require('handlebars');
var components = require('./components');
var glob = require('glob');
var path = require('path');
var fs = require('fs');

/**
 * Set up the handlebars engine
 * @return {Promise} Promise which resolves with the handlebars object
 */
function init() {
  return new Promise(function(resolve, reject) {
    resolve(handlebars.create());
  });
}

/**
 * Register core handlebars helpers (I.e. those that are not part of a component)
 * @param {Object} hbs The handlebars object to register things with
 * @return {Promise} Promise which resolves with the handlebars object
 */
function registerCoreHelpers(hbs) {
  return new Promise(function(resolve, reject) {
    glob('build/handlebars/helpers/**/*.js', function(er, files) {
      files.forEach(function(filename) {
        var helper = require(path.relative(__dirname, filename));
        hbs.registerHelper(path.basename(filename, path.extname(filename)), helper(hbs));
      });

      if(er) {
        reject(er)
      } else {
        resolve(hbs);
      }
    });
  });
}

/**
 * Register our layouts
 * @param {Object} hbs The handlebars object to register things with
 * @return {Promise} Promise which resolves with the handlebars object
 */
function registerLayouts(hbs) {
  return new Promise(function(resolve, reject) {

    // Register custom layouts that will inherit from the above
    glob('src/layouts/**/*.hbs', function (er, files) {
      files.forEach(function(filename) {
        hbs.registerPartial('layout/' + path.basename(filename, path.extname(filename)), fs.readFileSync(filename, 'utf8'));
      });

      if(er) {
        reject(er)
      } else {
        resolve(hbs);
      }
    });
  });
}

/**
 * Register all the components
 * @param {Object} hbs The handlebars object to register things with
 * @return {Promise} Promise which resolves with the handlebars object
 */
function registerComponents(hbs) {
  return new Promise(function(resolve, reject) {
    components.getComponents()
      .then(function(components) {

        components.forEach(function(component) {
          if(component.template) {
            hbs.registerPartial(component.id, component.template);
          }
        });

        resolve(hbs);
      });
  });
}

module.exports = function() {
  return new Promise(function(resolve, reject) {
    init()
      .then(registerCoreHelpers)
      .then(registerLayouts)
      .then(registerComponents)
      .then(resolve)
      .catch(reject);
  });
}
