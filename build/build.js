var sass = require('./modules/sass');

sass()
  .then(function() {
    console.log('CSS built');
  })
  .catch(function(e) {
    console.log(e);
  });
