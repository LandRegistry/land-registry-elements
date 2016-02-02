var should = require('should');
var request = require('superagent');
var components = require('../../build/modules/components');

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

  this.timeout(10000);

  it('should be valid HTML', function(done) {

    components.getComponents()
      .then(function(components) {

        components.forEach(function(component) {

          for(variant in component.variants) {
            if(component.variants.hasOwnProperty(variant)) {

              var url = 'http://localhost:3000/components/' + component.id + '/' + variant;

              validationQueue.push(new Promise(function(resolve, reject) {
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

                        resolve();
                      }
                    });
                  });
              }));

            }
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
