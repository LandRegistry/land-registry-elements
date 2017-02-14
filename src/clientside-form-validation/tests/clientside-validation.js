// var should = require('should');
var webdriverio = require('webdriverio');
var selenium = require('selenium-standalone');


describe('Clientside validation', function() {

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
          done();
        });
      }
    );

  });


  it('should display a summary of errors when submitting an incomplete form', function(done) {

    client
      .init()
      .url('http://localhost:3000/components/elements/land-registry/clientside-form-validation/demo/')
      .waitForExist('.phantom-js-test-rendering', 5000)
      .setValue('#full-name', 'WebdriverIO')
      .submitForm('#example_form')
      .element('.error-summary')
      .call(done);
  });

  after(function(done) {
    done();
  });

});
