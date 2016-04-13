var components = require('../../build/modules/components');
var fs = require('fs');
var mkdirp = require('mkdirp');
var webshot = require('webshot');
var sanitize = require('sanitize-filename');
var url = require('url');
var trim = require('trim-character');
var extend = require('extend');
var throat = require('throat')(3)

require('../server');

mkdirp.sync('test/fixtures/visual-regression/reference-renderings');

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


require('./testURLs')
  .then(function(urls) {

    var promises = [];

    urls.forEach(function(componentUrl) {

      var fileName = url.parse(componentUrl).pathname;
      fileName = fileName.replace(new RegExp('/', 'g'), '-');
      fileName = trim(fileName, '-');
      fileName = sanitize(fileName);

      // Desktop screenshot
      promises.push(throat(function() {
        return new Promise(function(resolve, reject) {
          var renderStream = webshot(componentUrl, options);
          var file = fs.createWriteStream('test/fixtures/visual-regression/reference-renderings/desktop-' + fileName + '.png', {encoding: 'binary'});

          renderStream.on('data', function(data) {
            file.write(data.toString('binary'), 'binary');
          });

          renderStream.on('end', function() {
            console.log('Desktop screenshot taken for', componentUrl);

            resolve();
          });
        });
      }));

      // Mobile screenshot
      promises.push(throat(function() {
        return new Promise(function(resolve, reject) {

          var renderStream = webshot(componentUrl, mobileOptions);
          var file = fs.createWriteStream('test/fixtures/visual-regression/reference-renderings/mobile-' + fileName + '.png', {encoding: 'binary'});

          renderStream.on('data', function(data) {
            file.write(data.toString('binary'), 'binary');
          });

          renderStream.on('end', function() {
            console.log('Mobile screenshot taken for', componentUrl);

            resolve();
          });
        });
      }));

    });

    return Promise.all(promises);

  })
  .then(function() {
    // For some reason the process doesn't exit on it's own (PhantomJS related somehow?)
    process.exit();
  });
