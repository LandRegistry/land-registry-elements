console.time('Starting server');

require('promise-helpers');
var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();

/**
 * Serve static files such as css, js, images
 */
app.use('/images', express.static('dist/assets/images'));
app.use('/javascripts', express.static('dist/assets/javascripts'));
app.use('/stylesheets', express.static('dist/assets/stylesheets'));

// Individual routes pulled from the routes directory
fs.readdir(path.join(__dirname, '/routes'), function(err, files) {
  if(err) {
    require('trace');
    require('clarify');
    console.trace(err);
  }

  files.forEach(function(file) {
    require(path.join(__dirname, '/routes/') + file)(app);
  });
});

// Go go go
app.listen(process.env.PORT || 3000);

console.log('listening on localhost:' + (process.env.npm_config_port || 3000));

// Export our server for testing purposes
module.exports = app;

console.timeEnd('Starting server');
