var should = require('should');
var request = require('supertest')

var app = require('../../build/server');

/**
 * Basic sanity checks on the dev server
 */
describe('The dev server', function() {
  it('should send with a well formed response for the index page', function(done) {
    request(app)
      .get('/')
      .expect('Content-Type', /text\/html/)
      .expect(200, done);
  });

  it('should respond with a 404 for a random route', function(done) {
    request(app)
      .get('/this-route-will-never-exist-uXS3lwt4vXmfeG1vC6HbPMwOqS9zN8SwlilOzofbuap9Vsh1C1YTlDMh5maE7jlmyyrgLv6UxxfU3OgQuMxOQWzGLBMM2ndEaTK7')
      .expect('Content-Type', /text\/html/)
      .expect(404, done);
  });
});
