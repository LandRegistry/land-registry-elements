var should = require('should');
var request = require('superagent');
var fs = require('fs');
var htmllint = require('htmllint');

/**
 * HTML validation checks
 */
describe('The pattern library page at', function() {
  var urls = JSON.parse(fs.readFileSync('.tmp/testURLs.json', 'utf8'));

  this.timeout(5000);

  urls.forEach(function(url) {

    it(url + ' should be valid HTML', function(done) {

      request
        .get(url)
        .end(function(err, res){

          htmllint(res.text, {
            'attr-name-style': false,
            'attr-bans': ['align', 'background', 'bgcolor', 'border', 'frameborder', 'longdesc', 'marginwidth', 'marginheight', 'scrolling'],
            'doctype-first': true,
            'doctype-html5': true,
            'id-class-style': false,
            'indent-style': false,
            'indent-width': false,
            'img-req-alt': false, // Disabled due to changes upstream in htmllint. See https://github.com/LandRegistry/land-registry-elements/issues/46
            'label-req-for': true,
            'tag-name-match': true,
            'tag-name-lowercase': true,
            'line-end-style': false,
            'attr-req-value': false,
            'tag-bans': ['style'],
            'title-max-len': false
          })
            .then(function(issues) {

              if(issues === false) {
                return done();
              }

              var output = url;

              issues.forEach(function(issue) {
                output += '\nLine: ' + issue.line + ' Col: ' + issue.column + ' => ' + (issue.msg || htmllint.messages.renderIssue(issue)) + '\n';
              });

              output.should.be.equal(url);

              return done();
            })
            .catch(function(e) {
              done(e)
            });
        });

    });

  });
});
