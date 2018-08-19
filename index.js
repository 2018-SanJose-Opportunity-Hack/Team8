var express = require('express');

var server = express();

server.use(express.static(__dirname + '/www'));

var bodyParser = require('body-parser');
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

var port = process.env.PORT || 5000;

var users = require(__dirname + '/www/data/Users.json');
var communities = require(__dirname + '/www/data/communities.json');
var events = require(__dirname + '/www/data/events.json');

var app = server.listen(port, function () {
  console.log('server listening on port ' + port);
});

server.get('/ping', function (req, res) {
  console.log('GET /ping called.');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.status(200).send('Success');
});

server.get('/community-events', function (req, res) {
  console.log('GET /community-events called');
  console.log('Param Name: ' + req.query.community);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  //TODO: add logic here instead of returning hard coded.
  res.status(200).send([{ "name": "Kayaking", "location": "Willow Lake, San Jose" }, { "name": "Soccer Game", "location": "Lee Fields, San Jose" }]);
});

server.get('/eventDetails', function (req, res) {
  console.log('GET /eventDetails called');
  var eventId = escape(req.query.id);
  console.log('Param Name: Event ID: ' + eventId);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  var desiredEvent = events.find( function(event) {
    return event.eventId === eventId;
  });
  if(desiredEvent) {
    res.status(200).send(desiredEvent);
  } else {
    res.status(404).send('No such event found');
  }
});