var fs = require('fs');

var components = require('../modules/components');
var handlebars = require('../modules/handlebars');
var renderPage = require('../modules/renderPage');

/**
 * Helper method to organise components by their categories
 */
function sortComponents(components) {

  // Sort the components by category
  var sortedComponents = {};
  components.forEach(function(component) {

    // If the component doesn't define any demos, don't bother rendering it
    if(Object.keys(component.variants).length === 0) {
      return;
    }

    if(!component.categories) {
      component.categories = {
        primary: 'Unsorted',
        secondary: 'Unsorted'
      };
    }

    if(!sortedComponents[component.categories.primary]) {
      sortedComponents[component.categories.primary] = {};
    }

    if(!sortedComponents[component.categories.primary][component.categories.secondary]) {
      sortedComponents[component.categories.primary][component.categories.secondary] = [];
    }

    sortedComponents[component.categories.primary][component.categories.secondary].push(component);
  });

  return sortedComponents;
}

module.exports = function(app){

  /**
   * Main index page route
   */
  app.get('/', function(req, res) {

    Promise
      .all([
        handlebars(),
        components.getComponents()
      ])
      .spread(function(hbs, components) {

        res.send(renderPage(hbs, {
          title: 'Index',
          content: hbs.compile(hbs.partials['layout/index'])({
            components: sortComponents(components),
            readme: fs.readFileSync('README.md')
          })
        }));

      })
      .catch(function(err) {
        throw err;

        res.send(renderPage(hbs, {
          title: 'Index',
          content: 'Error'
        }));
      });
  });

}
