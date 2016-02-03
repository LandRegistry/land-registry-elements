var tgz = require('express-tgz');
var build = require('../build');

module.exports = function(app){

  /**
   * Download a tarball of the built out assets
   */
  app.get('/build', function(req, res){
    build({
      components: true
    })
      .then(function(directory) {
        res.tgz(directory, 'land-registry-elements.tar.gz', false);
      });
  });
}
