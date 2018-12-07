var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {  //basically this routes to the homepage (requests it)
  res.sendFile("splash.html", {root: "./public"});  //sends the splash.html file on localhost load (main page load)
});

module.exports = router;
