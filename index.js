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
  var communityName = unescape(req.query.communityName);
  console.log('Param Name: ' + communityName);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  var communityCenter = communities.find( function (community) {
      return communityName === community.CommCenterName;
  });
  console.log('The comm center is: ' + JSON.stringify(communityCenter));
  if(communityCenter) {
    var communityCenterEvents = events.filter( function(event) {
      return event.CCId === communityCenter.CommCenterID;
    });
    if(communityCenterEvents) {
      res.status(200).send(communityCenterEvents);
    } else {
      res.status(404).send({'error': 'No upcoming events for this community center.'});
    }
  } else {
    res.status(404).send({'error': 'No such community center found.'});
  }
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
    res.status(404).send({'error': 'No such event found.'});
  }
});