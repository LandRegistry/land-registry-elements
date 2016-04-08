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
    // Notices are not *failures*, so we ignore them
    ignore: [
      'notice',
      // 'warning'
      // Rather than ignoring all warnings, ignore specific ones as some of them are still useful
      'WCAG2AA.Principle1.Guideline1_4.1_4_3.G145.BgImage',
      'WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.BgImage',
      'WCAG2AA.Principle1.Guideline1_1.1_1_1.H67.2',
      'WCAG2AA.Principle1.Guideline1_4.1_4_3_F24.F24.BGColour',
      'WCAG2AA.Principle1.Guideline1_3.1_3_1.H49.I',
      'WCAG2AA.Principle1.Guideline1_3.1_3_1.H39.3.NoCaption',
      'WCAG2AA.Principle1.Guideline1_3.1_3_1.H73.3.NoSummary',
      'WCAG2AA.Principle1.Guideline1_3.1_3_1.H42',
      'WCAG2AA.Principle1.Guideline1_3.1_3_1.H49.B',
      'WCAG2AA.Principle1.Guideline1_3.1_3_1.H48'
    ]
  });

  this.timeout(30000);

  // Specific URLs to ignore
  var urlIgnore = [
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

        if(!Array.isArray(results)) {
          done();
          return;
        }

        results.forEach(function(result) {

          // Manually suppress leafletjs related errors
          if(result.context.indexOf('leaflet') !== -1) {
            return;
          }

          // Suppress phase-tag colour contrast errors
          if(result.code === 'WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail' && (result.context.indexOf('phase-tag') !== -1 || result.context.indexOf('phase-tag-beta') !== -1 || result.context.indexOf('phase-tag-alpha') !== -1)) {
            return;
          }

          output += os.EOL + os.EOL + result.code + os.EOL + result.message + os.EOL + (result.context ? result.context + os.EOL : '')  + result.selector
        });

        output.should.equal('', 'Accessibility errors found');

        done();
      });

    });

  });
});
