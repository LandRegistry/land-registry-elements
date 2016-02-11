/**
 * Helper function for rendering a page
 * Abstracted out here to reduce some duplication in the main server
 */
var renderPage = function(hbs, data) {

  return hbs.compile(hbs.partials['layout/govuk_template'])({
    head: [
      '<!--[if IE 6]><link rel="stylesheet" type="text/css" media="all" href="/stylesheets/elements-ie6.css" /><![endif]-->',
      '<!--[if IE 7]><link rel="stylesheet" type="text/css" media="all" href="/stylesheets/elements-ie7.css" /><![endif]-->',
      '<!--[if IE 8]><link rel="stylesheet" type="text/css" media="all" href="/stylesheets/elements-ie8.css" /><![endif]-->',
      '<!--[if gt IE 8]><!--><link rel="stylesheet" type="text/css" media="all" href="/stylesheets/elements.css" /><!--<![endif]-->'
    ].join('\n'),
    pageTitle: data.title + ' - Land Registry pattern library',
    assetPath: '/',
    skipLinkMessage: 'Skip to main content',
    crownCopyrightMessage: 'Copyright message here',
    homepageUrl: '/',
    globalHeaderText: 'Land Registry',
    htmlLang: 'en',
    content: data.content,
    bodyEnd: [
      '<!--[if lte IE 9]><script src="/javascripts/ie8-9-polyfills.js"></script><![endif]-->',
      '<script src="/javascripts/landregistry.js"></script>'
    ].join('\n')
  });
}

module.exports = renderPage;
