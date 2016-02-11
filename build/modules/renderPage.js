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
    crownCopyrightMessage: '© Crown copyright',
    homepageUrl: '/',
    globalHeaderText: ' Land Registry',
    cookieMessage: '<p>Land Registry uses cookies to make the site simpler. <a href="https://www.gov.uk/help/cookies">Find out more about cookies</a></p>',
    htmlLang: 'en',
    content: data.content,
    footerSupportLinks: [
      '<ul>',
        '<li><a href="#">Terms &amp; Conditions</a></li>',
        '<li>Built by the <a href="https://www.gov.uk/government/organisations/land-registry">Land Registry</a></li>',
        '<li>If you need help using the service you can call Land Registry on 0300 006 0411. If you need to speak to someone in Welsh call 0300 006 0422.</li>',
      '</ul>'
    ].join('\n'),
    licenceMessage: '<p>All content is available under the <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" rel="license">Open Government Licence v3.0</a>, except where otherwise stated</p>',
    bodyEnd: [
      '<!--[if lte IE 9]><script src="/javascripts/ie8-9-polyfills.js"></script><![endif]-->',
      '<script src="/javascripts/landregistry.js"></script>'
    ].join('\n')
  });
}


module.exports = renderPage;
