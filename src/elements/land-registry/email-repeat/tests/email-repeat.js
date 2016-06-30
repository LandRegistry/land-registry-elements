// var should = require('should');
var webdriverio = require('webdriverio');
var selenium = require('selenium-standalone');

describe('Email repeat', function() {

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


  it('should mirror the value in the email input', function(done) {

    client
      .url('http://localhost:3000/components/elements/land-registry/email-repeat/demo/')
      .waitForExist('.phantom-js-test-rendering', 5000)
      .setValue('#username', 'foo@bar.com')
      .getText('.email-hint-value')
      .then(function(text) {
        text.should.be.equal('foo@bar.com')
      })
      .setValue('#username', 'wibble@bob.co.uk')
      .getText('.email-hint-value')
      .then(function(text) {
        text.should.be.equal('wibble@bob.co.uk')
      })
      .call(done);
  });

  it('should disappear again if the email input is emptied and then reappear if filled in again', function(done) {

    client
      .url('http://localhost:3000/components/elements/land-registry/email-repeat/demo/')
      .waitForExist('.phantom-js-test-rendering', 5000)
      .setValue('#username', 'foo@bar.com')
      .getText('.email-hint-value')
      .then(function(text) {
        text.should.be.equal('foo@bar.com')
      })
      .clearElement('#username')
      .waitForExist('.email-hint-value', 5000, true)
      .setValue('#username', 'wibble@bob.co.uk')
      .getText('.email-hint-value')
      .then(function(text) {
        text.should.be.equal('wibble@bob.co.uk')
      })
      .call(done);
  });

  after(function(done) {
    done();
  });

});
