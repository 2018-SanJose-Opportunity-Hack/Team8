var express = require('express');

var server = express();

server.use(express.static(__dirname + '/www'));

var bodyParser = require('body-parser');
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

var port = process.env.PORT || 9000;

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

/* For getting all events for a particular community center */
server.get('/community-events', function (req, res) {
  console.log('GET /community-events called');
  var communityName = unescape(req.query.communityName);
  console.log('Param Name: ' + communityName);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  console.log('The comm center is: ' + JSON.stringify(communityName));
  var count = 0;
  if(communityName) {
    var communityCenterEvents = events.filter( function(event) {
      return event.EventCommName === communityName && ++count < 10;
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

/* For getting details of a specific event */
server.get('/eventDetails', function (req, res) {
  console.log('GET /eventDetails called');
  var eventId = escape(req.query.id);
  console.log('Param Name: Event ID: ' + eventId);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
  var desiredEvent = events.find( function(event) {
    return event.EventID == eventId;
  });
  if(desiredEvent) {
    res.status(200).send(desiredEvent);
  } else {
    res.status(404).send({'error': 'No such event found.'});
  }
});

/* Basic signup for a user */
server.post('/signup', function (req, res){
  console.log('POST /signup called');
  var firstname = escape(req.body.firstname);
  var lastname = escape(req.body.lastname);
  var email = escape(req.body.email);
  var password = escape(req.body.password);
  var newUserId = 1000 + Math.floor(Math.random()*8000)+'';
  console.log('new User Details '+ firstname+ ' '+ lastname);
  var newUser = {
    'UserId': newUserId,
    'FirstName': firstname,
    'LastName': lastname,
    'email': email,
    'password': password,
    'registrationComplete': 'false'
  };
  //TODO: please encrypt password
  var length = users.length;
  users[length+1] = newUser;
  res.status(200).send({'success':'Sign Up complete!'});

});

/* Basic Log in for a user */
server.post('/login', function (req, res) {
  console.log('POST /login called');
  var email = escape(req.body.email);
  var password = escape(req.body.password);

  var isLoggedInUser = users.find( function(user) {
    return user.email === email && user.password === password;
  });
  if(isLoggedInUser) {
    res.status(200).send(isLoggedInUser);
  } else {
    res.status(404).send({'error': 'Invalid credentials. Please try again'});
  }
});

/* Complete registration for a user by storing all collected data */
server.post('/completeRegistration', function (req, res) {

});

/* Store a user's interests for future use */
server.post('/myinterests', function (req, res) {

});

/* Get suggested events for a user */
server.post('/mysuggestions', function (req, res) {

});

/* Basic site search will return events or community centers */
server.get('/search', function (req, res) {

});

/* Register for an event */
server.post('/registerForEvent', function (req, res) {

});

