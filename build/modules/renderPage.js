/**
 * Helper function for rendering a page
 * Abstracted out here to reduce some duplication in the main server
 */
var renderPage = function(hbs, data) {

  return hbs.compile(hbs.partials['layout/govuk_template'])({
    head: [
      '<!--[if IE 6]><link rel="stylesheet" type="text/css" media="screen" href="/stylesheets/elements-ie6.css" /><!--<![endif]-->',
      '<!--[if IE 7]><link rel="stylesheet" type="text/css" media="screen" href="/stylesheets/elements-ie7.css" /><!--<![endif]-->',
      '<!--[if IE 8]><link rel="stylesheet" type="text/css" media="screen" href="/stylesheets/elements-ie8.css" /><!--<![endif]-->',
      '<!--[if gt IE 8]><!--><link rel="stylesheet" type="text/css" media="screen" href="/stylesheets/elements.css" /><!--<![endif]-->'
    ].join('\n'),
    pageTitle: data.title + ' - Land Registry pattern library',
    assetPath: '/',
    content: data.content
  });
}

module.exports = renderPage;
