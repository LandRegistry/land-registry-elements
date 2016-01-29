var should = require('should');
var request = require('superagent');
var crawl = require('crawl');
var w3cjs = require('w3cjs');

var app = require('../../build/server');


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

          validationQueue.push(new Promise(function(resolve, reject) {
            request
              .get(page.url)
              .end(function(err, res){

                w3cjs.validate({
                  input: res.text,
                  callback: function (res) {

                    var output = '';

                    res.messages.forEach(function(message) {
                      if(message.type === 'info') {
                        return;
                      }

                      output += '\nLine: ' + message.lastLine + ' Col: ' + message.firstColumn + ' => ' + message.message;
                    });

                    output.should.be.equal('');

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
