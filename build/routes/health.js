module.exports = function(app){

  app.get('/health', function(req, res) {
    res.sendStatus(200)
  });

}
