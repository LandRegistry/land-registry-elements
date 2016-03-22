var should = require('should');
var request = require('superagent');
var fs = require('fs');
var webshot = require('webshot');
var sanitize = require('sanitize-filename');
var url = require('url');
var mkdirp = require('mkdirp');
var gm = require('gm');
var path = require('path');

var options = {
  renderDelay: 1000,
  timeout: 10000,
  errorIfStatusIsNot200: true,
  shotSize: {
    width: 'all',
    height: 'all'
  }
};

mkdirp.sync('test/fixtures/visual-regression/test-renderings');
mkdirp.sync('test/fixtures/visual-regression/diff-renderings');

/**
 * Visual regression checks
 */
describe('The pattern library page at', function() {
  var urls = JSON.parse(fs.readFileSync('.tmp/testURLs.json', 'utf8'));

  this.timeout(30000);

  urls.forEach(function(componentUrl) {

    it(componentUrl + ' should not have regressed visually', function(done) {

      var fileName = url.parse(componentUrl).pathname;
      fileName = fileName.replace(new RegExp('/', 'g'), '-');
      fileName = sanitize(fileName);

      var renderStream = webshot(componentUrl, options);
      var file = fs.createWriteStream('test/fixtures/visual-regression/test-renderings/' + fileName + '.png', {encoding: 'binary'});
      var referenceRendering = fs.readFileSync('test/fixtures/visual-regression/reference-renderings/' + fileName + '.png');

      renderStream.on('data', function(data) {
        file.write(data.toString('binary'), 'binary');
      });

      renderStream.on('end', function() {
        file.end();
      });

      var gmOptions = {
        file: 'test/fixtures/visual-regression/diff-renderings/' + fileName + '.png'
      };

      file.on('finish', function() {

        gm.compare('test/fixtures/visual-regression/test-renderings/' + fileName + '.png', 'test/fixtures/visual-regression/reference-renderings/' + fileName + '.png', gmOptions, function (err, isEqual, equality, raw, path1, path2) {
          if (err) throw err;

          //equality.should.below(0.001);
          isEqual.should.be.true();

          done();
        });

      });

    });

  });
});
