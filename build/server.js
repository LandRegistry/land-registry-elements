require('promise-helpers');
var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
var errorhandler = require('errorhandler')

// Error handler
app.use(errorhandler());

/**
 * Serve static files such as css, js, images
 */
app.use('/images', express.static('dist/assets/images'));
app.use('/javascripts', express.static('dist/assets/javascripts'));
app.use('/stylesheets', express.static('dist/assets/stylesheets'));

// Individual routes pulled from the routes directory
fs.readdirSync(path.join(__dirname, '/routes')).forEach(function(file) {
  require(path.join(__dirname, '/routes/') + file)(app);
});

// Go go go
app.listen(process.env.PORT || 3000);

console.log('listening on localhost:' + (process.env.PORT || 3000));

// Export our server for testing purposes
module.exports = app;
