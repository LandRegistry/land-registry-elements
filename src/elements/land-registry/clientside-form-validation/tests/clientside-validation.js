var should = require('should');
var request = require('supertest')

describe('Clientside validation ', function() {
  it('should work', function(done) {
    'foo'.should.equal('foo');

    done();
  });
});
