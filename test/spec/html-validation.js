var should = require('should');
var request = require('superagent');
var fs = require('fs');
var w3cjs = require('w3cjs');

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

          w3cjs.validate({
            input: res.text,
            callback: function (res) {

              var output = url;

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

              output.should.be.equal(url);

              done();
            }
          });
        });

    });

  });
});
