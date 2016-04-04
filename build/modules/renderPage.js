var components = require('./components');
var javascript = require('../tasks/javascript');
var extend = require('extend');

/**
 * Helper function for rendering a page
 * Abstracted out here to reduce some duplication in the main server
 */
var renderPage = function(hbs, data) {

  return new Promise(function(resolve, reject) {
    var pageData = {
      pageTitle: data.title + ' - Land Registry pattern library',
      assetPath: '/',
      homepageUrl: '/',
      content: data.content,
      scripts: [],
      propositionName: 'Land Registry pattern library'
    };

    // If any of the demos define pageData we need to pop this up onto the page context
    extend(pageData, data.pageData);

    // Grab all our components, sort them into bundles and then output the
    // necessary script tags to load them
    components
      .getComponents()
      .then(javascript.sort)
      .then(function(bundles) {
        Object.keys(bundles).forEach(function(bundle) {
          pageData.scripts.push('<script defer src="/javascripts/' + bundle + '.js"></script>')
        });
      })
      .then(function() {
        pageData.scripts = pageData.scripts.join('\n');
      })
      .then(function() {
        resolve(hbs.compile(hbs.partials['layout/govuk_template'])(pageData));
      })
      .catch(function(err) {
        reject(err);
      });

  })


}


module.exports = renderPage;
