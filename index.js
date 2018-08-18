var express = require('express');

var server = express();

server.use(express.static(__dirname + '/www'));

var bodyParser = require('body-parser'); 
server.use(bodyParser.json()); 
server.use(bodyParser.urlencoded({ extended: true }));

var port = process.env.PORT || 5000;

var app = server.listen(port, function() {
  console.log('server listening on port ' + port);
});