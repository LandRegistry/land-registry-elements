var should = require('should');
var request = require('superagent');
var fs = require('fs');
var webshot = require('webshot');
var sanitize = require('sanitize-filename');
var url = require('url');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var path = require('path');
var resemble = require('node-resemble-js');
var trim = require('trim-character');
var extend = require('extend');

var options = {
  takeShotOnCallback: true,
  timeout: 30000,
  errorIfStatusIsNot200: true,
  shotSize: {
    width: 'all',
    height: 'all'
  }
};

var mobileOptions = extend({}, options);

mobileOptions.screenSize = {
  width: 320,
  height: 480
};

mobileOptions.shotSize = {
  width: 320,
  height: 'all'
};


var tolerance = 0.05;

rimraf.sync('test/fixtures/visual-regression/test-renderings');
rimraf.sync('test/fixtures/visual-regression/diff-renderings');

mkdirp.sync('test/fixtures/visual-regression/test-renderings');
mkdirp.sync('test/fixtures/visual-regression/diff-renderings');

/**
 * Visual regression checks
 */
describe('The pattern library page at', function() {
  var urls = JSON.parse(fs.readFileSync('.tmp/testURLs.json', 'utf8'));

  this.timeout(30000);

  urls.forEach(function(componentUrl) {

    it(componentUrl + ' should not have regressed visually on desktop', function(done) {

      var fileName = url.parse(componentUrl).pathname;
      fileName = fileName.replace(new RegExp('/', 'g'), '-');
      fileName = trim(fileName, '-');
      fileName = sanitize(fileName);
      fileName = 'desktop-' + fileName;

      var renderStream = webshot(componentUrl, options);
      var file = fs.createWriteStream('test/fixtures/visual-regression/test-renderings/' + fileName + '.png', {encoding: 'binary'});
      var referenceRendering = fs.readFileSync('test/fixtures/visual-regression/reference-renderings/' + fileName + '.png');

      renderStream.on('data', function(data) {
        file.write(data.toString('binary'), 'binary');
      });

      renderStream.on('end', function() {
        file.end();
      });

      resemble.outputSettings({
        largeImageThreshold: 0
      });

      file.on('finish', function() {

        resemble('test/fixtures/visual-regression/test-renderings/' + fileName + '.png')
          .compareTo('test/fixtures/visual-regression/reference-renderings/' + fileName + '.png')
          .onComplete(function(data){

            if(!data.isSameDimensions || data.misMatchPercentage > tolerance) {
              data.getDiffImage()
                .pack()
                .pipe(fs.createWriteStream('test/fixtures/visual-regression/diff-renderings/' + fileName + '.png'))
                .on('close', function() {

                  data.isSameDimensions.should.be.true;
                  data.misMatchPercentage.should.below(tolerance);

                  done();
                });
            } else {
              done();
            }

          });

      });

    });

    it(componentUrl + ' should not have regressed visually on mobile', function(done) {

      var fileName = url.parse(componentUrl).pathname;
      fileName = fileName.replace(new RegExp('/', 'g'), '-');
      fileName = trim(fileName, '-');
      fileName = sanitize(fileName);
      fileName = 'mobile-' + fileName;

      var renderStream = webshot(componentUrl, mobileOptions);
      var file = fs.createWriteStream('test/fixtures/visual-regression/test-renderings/' + fileName + '.png', {encoding: 'binary'});
      var referenceRendering = fs.readFileSync('test/fixtures/visual-regression/reference-renderings/' + fileName + '.png');

      renderStream.on('data', function(data) {
        file.write(data.toString('binary'), 'binary');
      });

      renderStream.on('end', function() {
        file.end();
      });

      resemble.outputSettings({
        largeImageThreshold: 0
      });

      file.on('finish', function() {

        resemble('test/fixtures/visual-regression/test-renderings/' + fileName + '.png')
          .compareTo('test/fixtures/visual-regression/reference-renderings/' + fileName + '.png')
          .onComplete(function(data){

            if(!data.isSameDimensions || data.misMatchPercentage > tolerance) {
              data.getDiffImage()
                .pack()
                .pipe(fs.createWriteStream('test/fixtures/visual-regression/diff-renderings/' + fileName + '.png'))
                .on('close', function() {

                  data.isSameDimensions.should.be.true;
                  data.misMatchPercentage.should.below(tolerance);

                  done();
                });
            } else {
              done();
            }

          });

      });

    });

  });
});
