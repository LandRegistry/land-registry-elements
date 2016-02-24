var should = require('should');
var request = require('superagent');
var fs = require('fs');
var webshot = require('webshot');
var sanitize = require('sanitize-filename');
var url = require('url');
var mkdirp = require('mkdirp');
var imageDiff = require('image-diff');
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

      console.log('testing', componentUrl);

      var fileName = url.parse(componentUrl).pathname;
      fileName = fileName.replace(new RegExp('/', 'g'), '-');
      fileName = sanitize(fileName);

      var renderStream = webshot(componentUrl, options);
      var file = fs.createWriteStream('test/fixtures/visual-regression/test-renderings/' + fileName + '.png', {encoding: 'binary'});
      var referenceRendering = fs.readFileSync('test/fixtures/visual-regression/reference-renderings/' + fileName + '.png');

      renderStream.on('data', function(data) {
        console.log("renderStream.on('data')");
        file.write(data.toString('binary'), 'binary');
      });

      renderStream.on('end', function() {
        console.log("renderStream.on('end')");
        file.end();
      });

      file.on('finish', function() {
        console.log("file.on('finish')");

        imageDiff({
          actualImage: path.resolve(__dirname, '../../test/fixtures/visual-regression/test-renderings/' + fileName + '.png'),
          expectedImage: path.resolve(__dirname, '../../test/fixtures/visual-regression/reference-renderings/' + fileName + '.png'),
          diffImage: path.resolve(__dirname, '../../test/fixtures/visual-regression/diff-renderings/' + fileName + '.png')
        }, function (err, imagesAreSame) {
          if(err) console.error(err);

          console.log('imageDiff results', imagesAreSame);

          imagesAreSame.should.be.true();

          done();
        });

      });

    });

  });
});
