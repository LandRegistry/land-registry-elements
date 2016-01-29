require('promise-helpers');
var fs = require('fs');

var extend = require('extend');
var express = require('express');
var app = express();
var components = require('./modules/components');
var pages = require('./modules/pages');
var handlebars = require('./modules/handlebars');

/**
 * Serve static files such as css, js, images
 */
app.use('/images', express.static('dist/assets/images'));
app.use('/javascripts', express.static('dist/assets/javascripts'));
app.use('/stylesheets', express.static('dist/assets/stylesheets'));

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

      res.send(hbs.compile(hbs.partials['layout/govuk_template'])({
        head: '<link rel="stylesheet" href="/stylesheets/elements.css" />',
        assetPath: '/',
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
        assetPath: '/',
        content: hbs.compile(variant.content)(variant.context)
      }));

    })
    .catch(function(er) {
      console.log(er);
    });
});

/**
 * Page route
 */
app.get('/page/:page', function(req, res){
  Promise
    .all([
      handlebars(),
      pages.getPages()
    ])
    .spread(function(hbs, demoPages) {

      var page = demoPages[req.params.page];

      res.send(hbs.compile(hbs.partials['layout/govuk_template'])({
        head: '<link rel="stylesheet" href="/stylesheets/elements.css" />',
        assetPath: '/',
        content: hbs.compile(page.content)(page.context)
      }));
    })
    .catch(function(er) {
      console.log(er);
    });
});

// Go go go
app.listen(80);

console.log('Server listening on http://localhost:80');

// Export our server for testing purposes
module.exports = app;
