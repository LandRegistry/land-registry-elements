var tgz = require('express-tgz');

module.exports = function(app){

  /**
   * Download a tarball of the built out assets
   */
  app.get('/build', function(req, res){
    res.tgz('dist/assets', 'land-registry-elements.tar.gz', false);
  });
}
