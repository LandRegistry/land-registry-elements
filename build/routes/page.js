var pages = require('../modules/pages');
var handlebars = require('../modules/handlebars');

module.exports = function(app){

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
          pageTitle: 'Land Registry pattern library',
          assetPath: '/',
          content: hbs.compile(page.content)(page.context)
        }));
      })
      .catch(function(er) {
        console.log(er);
      });
  });

}
