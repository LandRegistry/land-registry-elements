var extend = require('extend');

var components = require('../modules/components');
var handlebars = require('../modules/handlebars');

module.exports = function(app){

  /**
   * Component route
   */
  app.get('/components/:component/:variant', function(req, res){

    Promise
      .all([
        handlebars(),
        components.getComponent(req.params.component)
      ])
      .spread(function(hbs, component) {
        var variant = component.variants[req.params.variant];
        var context = extend(variant.context, {component: component });

        res.send(hbs.compile(hbs.partials['layout/govuk_template'])({
          head: '<link rel="stylesheet" href="/stylesheets/elements.css" />',
          pageTitle: 'Land Registry pattern library',
          assetPath: '/',
          content: hbs.compile(variant.content)(variant.context)
        }));

      })
      .catch(function(er) {
        console.log(er);
      });
  });

}
