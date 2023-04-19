// Require express and create an instance of it
var express = require('express');
var app = express();

// on the request to root (localhost:3000/)
app.get('/', function (req, res) {
  console.log(req.params);
  // var username = req.params.user;
  // var category = req.params.categorySlug;
  res.send(req.params);
});

// Change the 404 message modifing the middleware
app.use(function(req, res, next) {
  res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
});

// start the server in the port 3000 !
app.listen(3000, function () {
  console.log('Example app listening on port 3000.');
});