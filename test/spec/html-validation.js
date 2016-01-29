var should = require('should');
var request = require('superagent');
var crawl = require('crawl');
var w3cjs = require('w3cjs');

var app = require('../../build/server');

var ignores = [];

var pathBlacklist = [
  '/stylesheets/',
  '/javascripts/',
  '/images/'
];

/**
 * HTML validation checks
 */
describe('The pattern library', function() {
  var validationQueue = [];

  this.timeout(5000);

  it('should be valid HTML', function(done) {
    crawl.crawl('http://localhost:' + (process.env.PORT || 3000), function(err, crawlResults) {
      if (err) {
        throw('An error occured while crawling before html validation', err);
        return;
      }

      crawlResults.forEach(function(page) {

        if(page.contentType.indexOf('text/html') !== '-1') {

          // TravisCI completely fails to return the correct content types making it impossible to filter out
          // non-html pages from our validation routine. Therefore, we simply filter out any URLs which we know
          // are not html pages
          var isBlacklisted = false;
          pathBlacklist.forEach(function(path) {
            if(page.url.indexOf(path) !== -1) {
              isBlacklisted = true;
            }
          });

          if(isBlacklisted) {
            return;
          }

          validationQueue.push(new Promise(function(resolve, reject) {

            request
              .get(page.url)
              .end(function(err, res){

                w3cjs.validate({
                  input: res.text,
                  callback: function (res) {

                    var output = page.url;

                    res.messages.forEach(function(message) {

                      // Don't need to fail the test for info messages
                      if(message.type === 'info') {
                        return;
                      }

                      // Exclude any warnings that we are ignoring
                      if(ignores.indexOf(message.message) !== -1) {
                        return;
                      }

                      output += '\nLine: ' + message.lastLine + ' Col: ' + message.firstColumn + ' => ' + message.message;
                    });

                    output.should.be.equal(page.url);

                    resolve();
                  }
                });

              });
          }));
        }
      });

      Promise
        .all(validationQueue)
        .then(function() {
          done();
        });
    });
  })
});
