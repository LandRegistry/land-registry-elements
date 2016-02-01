var components = require('../modules/components');
var pages = require('../modules/pages');
var handlebars = require('../modules/handlebars');
var renderPage = require('../modules/renderPage');

module.exports = function(app){

  /**
   * Main index page route
   */
  app.get('/', function(req, res) {

    Promise
      .all([
        handlebars(),
        components.getComponents(),
        pages.getPages()
      ])
      .spread(function(hbs, unsortedComponents, demoPages) {

        // Sort the components by category
        var sortedComponents = {};
        unsortedComponents.forEach(function(component) {

          // If the component doesn't define any demos, don't bother rendering it
          if(!component.variants) {
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

        res.send(renderPage(hbs, {
          title: 'Index',
          content: hbs.compile(hbs.partials['layout/index'])({
            components: sortedComponents,
            pages: demoPages
          })
        }));
      })
      .catch(function(er) {
        console.log(er);
      });
  });

}
