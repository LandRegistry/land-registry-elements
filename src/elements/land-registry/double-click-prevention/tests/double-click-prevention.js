// var should = require('should');
var webdriverio = require('webdriverio');
var selenium = require('selenium-standalone');

describe('Form session storage', function() {

  var client = webdriverio.remote({
    logLevel: 'command',
    desiredCapabilities: {
      browserName: 'phantomjs'
    }
  });

  this.timeout(30000);

  before(function(done){
    selenium.install(
      function (err) {
        if (err) return done(err);

        selenium.start(function() {
          client.init().then(function() {
            done();
          });
        });
      }
    );

  });

  it('should prevent people clicking more than once on input submits', function(done) {

    client
      .url('http://localhost:3000/components/elements/land-registry/double-click-prevention/demo/')
      .waitForExist('.phantom-js-test-rendering', 5000)
      .click('#button-1')
      .getAttribute('#button-2', 'disabled')
      .then(function(attr) {
        attr.should.be.equal('true')
      })
      .call(done);
  });

  it('should prevent people clicking more than once on buttons', function(done) {

    client
      .url('http://localhost:3000/components/elements/land-registry/double-click-prevention/demo/')
      .waitForExist('.phantom-js-test-rendering', 5000)
      .click('#button-2')
      .getAttribute('#button-2', 'disabled')
      .then(function(attr) {
        attr.should.be.equal('true')
      })
      .call(done);
  });

  after(function(done) {
    done();
  });

});
