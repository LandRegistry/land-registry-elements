var glob = require('glob');
var path = require('path');
var build = require('../../build/build');

// Search for test suites embedded in component folders and require all of them
var files = glob.sync('src/**/info.yaml');

files.forEach(function(file) {
  var component = file.replace('src/', '');
  component = component.replace('/info.yaml', '');

  describe('The ' + component + ' component', function() {
    this.timeout(30000);

    it('should build correctly without errors', function(done) {

      build({
          mode: 'development',
          cache: false,
          components: [component],
          destination: path.join('.tmp/test-builds', component)
        })
        .then(function(directory) {
          // console.log('Assets built to:', directory);
          done();
        })
        .catch(function(err) {
          done(err);
        });

    });
  });
});
