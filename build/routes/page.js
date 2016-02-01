var pages = require('../modules/pages');
var handlebars = require('../modules/handlebars');
var renderPage = require('../modules/renderPage');

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

        res.send(renderPage(hbs, {
          title: page.name,
          content: hbs.compile(page.content)(page.context)
        }));

      })
      .catch(function(er) {
        console.log(er);
      });
  });

}
