/* global describe,before,it,after */
var webdriverio = require('webdriverio')
var selenium = require('selenium-standalone')

describe('Form session storage', function () {
  var client = webdriverio.remote({
    logLevel: 'command',
    desiredCapabilities: {
      browserName: 'phantomjs'
    }
  })

  this.timeout(30000)

  before(function (done) {
    selenium.install(
      function (err) {
        if (err) return done(err)

        selenium.start(function () {
          client.init().then(function () {
            done()
          })
        })
      }
    )
  })

  it('should allow values to be transmitted from the set page to the get page', function (done) {
    var value = Math.random().toString()
    var value2 = Math.random().toString()

    client
      .url('http://localhost:3000/components/elements/land-registry/form-session-storage/set/')
      .waitForExist('.phantom-js-test-rendering', 5000)
      .setValue('#foo', value)
      .url('http://localhost:3000/components/elements/land-registry/form-session-storage/get/')
      .getValue('#foo')
      .then(function (text) {
        text.should.be.equal(value)
      })
      .getValue('#foo2')
      .then(function (text) {
        text.should.be.equal("This is a prefilled value, it won't get blown away by the value in sessionStorage")
      })
      .getValue('#foo3')
      .then(function (text) {
        text.should.be.equal(value)
      })

       // Set a new value the third field which is a get *and* a set
       // This should update both #foo and #foo3
      .setValue('#foo3', value2)
      .url('http://localhost:3000/components/elements/land-registry/form-session-storage/get/')
      .getValue('#foo')
      .then(function (text) {
        text.should.be.equal(value2)
      })
      .getValue('#foo3')
      .then(function (text) {
        text.should.be.equal(value2)
      })
      .call(done)
  })

  after(function (done) {
    done()
  })
})
