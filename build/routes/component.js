var extend = require('extend');

var components = require('../modules/components');
var handlebars = require('../modules/handlebars');
var renderPage = require('../modules/renderPage');

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

        res.send(renderPage(hbs, {
          title: variant.name,
          content: hbs.compile(variant.content)(variant.context)
        }));

      })
      .catch(function(er) {
        console.log(er);
      });
  });

}
