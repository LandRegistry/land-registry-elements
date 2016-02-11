var extend = require('extend');
var path = require('path');

var components = require('../modules/components');
var handlebars = require('../modules/handlebars');
var renderPage = require('../modules/renderPage');

module.exports = function(app){

  /**
   * Component route
   */
  app.get('/components/*/:variant', function(req, res){

    Promise
      .all([
        handlebars(),
        components.getComponent(path.join('src', req.params[0]))
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
