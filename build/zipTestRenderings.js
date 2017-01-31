var zipdir = require('zip-dir');

var destination = 'test/fixtures/visual-regression/test-renderings.zip';

zipdir('test/fixtures/visual-regression/test-renderings', { saveTo: destination }, function() {
  console.log('Test renderings zipped to', destination);
});
