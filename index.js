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

server.get('/sample', function (req, res) {
  console.log('GET /sample called.');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.status(200).send('Hello This is a sample response');
});