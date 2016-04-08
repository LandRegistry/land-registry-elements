var components = require('../../build/modules/components');
var fs = require('fs');
var mkdirp = require('mkdirp');
var webshot = require('webshot');
var sanitize = require('sanitize-filename');
var url = require('url');

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

require('./testURLs')
  .then(function(urls) {

    var promises = [];

    urls.forEach(function(componentUrl) {

      var fileName = url.parse(componentUrl).pathname;
      fileName = fileName.replace(new RegExp('/', 'g'), '-');
      fileName = sanitize(fileName);

      promises.push(new Promise(function(resolve, reject) {

        var renderStream = webshot(componentUrl, options);
        var file = fs.createWriteStream('test/fixtures/visual-regression/reference-renderings/' + fileName + '.png', {encoding: 'binary'});

        renderStream.on('data', function(data) {
          file.write(data.toString('binary'), 'binary');
        });

        renderStream.on('end', function() {
          console.log('Screenshot taken for', componentUrl);
          resolve();
        });
      }));

    });

    return Promise.all(promises);

  })
  .then(function() {
    // For some reason the process doesn't exit on it's own (PhantomJS related somehow?)
    process.exit();
  });
