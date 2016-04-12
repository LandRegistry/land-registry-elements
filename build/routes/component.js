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
        components.getComponent(req.params[0])
      ])
      .spread(function(hbs, component) {

        var variant = component.variants[req.params.variant];
        var context = extend(variant.context, {component: component });

        renderPage(hbs, {
          title: variant.name,
          content: hbs.compile(variant.content)(variant.context),
          pageData: variant.context.pageData
        })
        .then(function(html) {
          res.send(html);
        });

      })
      .catch(function(err) {
        require('trace');
        require('clarify');
        console.trace(err);
      });
  });

}
