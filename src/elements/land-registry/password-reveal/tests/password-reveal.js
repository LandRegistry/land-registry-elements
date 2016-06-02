// var should = require('should');
var webdriverio = require('webdriverio');
var selenium = require('selenium-standalone');


describe('Password reveal', function() {

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


  it('should toggle between input text and password when clicked ', function(done) {

    client
      .init()
      .url('http://localhost:3000/components/elements/land-registry/password-reveal/demo/')
      .waitForExist('.phantom-js-test-rendering', 5000)
      .waitForExist('#pass[type="password"]', 1000)
      .waitForExist('#show-password-pass', 1000)
      .click('#show-password-pass')
      .waitForExist('#pass[type="text"]', 1000)
      .click('#show-password-pass')
      .waitForExist('#pass[type="password"]', 1000)
      .call(done);
  });

  after(function(done) {
    done();
  });

});
