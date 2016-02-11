var should = require('should');
var request = require('superagent');
var fs = require('fs');
var pa11y = require('pa11y');
var os = require('os')

/**
 * Automated accessibility checks
 */
describe('The pattern library page at', function() {
  var urls = JSON.parse(fs.readFileSync('.tmp/testURLs.json', 'utf8'));
  var test = pa11y({
    allowedStandards: ['WCAG2AA', 'Section508']
  });

  this.timeout(30000);

  var levelsIgnore = [
    'notice',
    'warning'
  ];

  var urlIgnore = [
    '/components/elements/land-registry/leaflet-map/demo' // Ignore leafletJS page as the map is not accessible
  ];

  var codeIgnore = [
    'WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail'  // Ignore colour contrast fails
  ];

  urls.forEach(function(url) {

    var ignore = false;
    urlIgnore.forEach(function(item) {
      if(url.indexOf(item) !== -1) {
        ignore = true;
      }
    })

    if(ignore) {
      return;
    }

    it(url + ' should be accessible HTML', function(done) {

      test.run(url, function (error, results) {
        var output = '';

        results.forEach(function(result) {

          if(levelsIgnore.indexOf(result.type) !== -1) {
            return;
          }

          if(codeIgnore.indexOf(result.code) !== -1) {
            return;
          }

          output += os.EOL + os.EOL + result.code + os.EOL + result.message + os.EOL + result.context + os.EOL + result.selector
        });

        output.should.equal('', 'Accessibility errors found');

        done();
      });

    });

  });
});
