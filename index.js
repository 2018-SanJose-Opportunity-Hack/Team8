var express = require('express');

var server = express();

server.use(express.static(__dirname + '/www')).use('/node_modules', express.static('node_modules'));

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
      return event.EventCommName === communityName && ++count < 10; //TODO
    });
    if(communityCenterEvents) {
      res.status(200).send(communityCenterEvents);
    } else {
      res.status(200).send({'error': 'No upcoming events for this community center.'});
    }
  } else {
    res.status(200).send({'error': 'No such community center found.'});
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
    res.status(200).send({'error': 'No such event found.'});
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
  users[length] = newUser;
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
    res.status(200).send({'error': 'Invalid credentials. Please try again'});
  }
});

/* Complete registration for a user by storing all collected data */
server.post('/completeRegistration', function (req, res) {
  console.log('POST /completeRegistration called');
  
  var userId = req.body.userId;
  var address1 = req.body.address1;
  var address2 = req.body.address2;
  var city = req.body.city;
  var state = req.body.state;
  var zip = req.body.zip;
  var homephone = req.body.homephone;
  var emergencyname = req.body.emergencyfirstname;
  var emergencylastname = req.body.emergencylastname;
  var relationship = req.body.relationship;
  var parname = req.body.parfirstname;
  var parlastname = req.body.parlastname;
  var parage = req.body.parage;
  var pargender = req.body.gender;
  var dob = req.body.dob;

  console.log('Param Name: Event ID: ' + userId);
  var desiredUser = users.find( function(user) {
    return user.UserId == userId;
  });
  if(desiredUser) {
    for(var i= 0; i< users.length; i++){
      if(users[i].UserId == userId){
        users[i].Address1 = address1;
        users[i].Address2 = address2;
        users[i].City = city;
        users[i].State = state;
        users[i].Zip = zip;
        users[i].Phones.home = homephone;
        users[i].EmergencyContacts = users[i].EmergencyContacts || [];
        var emerlength = users[i].EmergencyContacts.length;
        users[i].EmergencyContacts[emerlength] = {};
        users[i].EmergencyContacts[emerlength].FirstName = emergencyname;
        users[i].EmergencyContacts[emerlength].LastName = emergencylastname;
        users[i].EmergencyContacts[emerlength].Relationship = relationship;
        users[i].Participants = users[i].Participants || [];
        var parlength = users[i].Participants.length;
        users[i].Participants[parlength] = {};
        users[i].Participants[parlength].FirstName = parname;
        users[i].Participants[parlength].LastName  = parlastname;
        users[i].Participants[parlength].Age  = parage;
        users[i].Participants[parlength].Gender  = pargender;
        users[i].Participants[parlength].dateOfBirth = dob;
        users[i].registrationComplete = "true";
        console.log(JSON.stringify(users[i]));
        break;
       }
    }

    res.status(200).send({'success': 'Registration Complete.'});
  } else {
    res.status(200).send({'error': 'No such User found.'});
  }
});

/* Store a user's interests for future use */
server.post('/myinterests', function (req, res) {
  console.log("POST /myinterests");
  console.log("req.body : ",req.body);
  var userId = escape(req.body.userid);
  var interests = req.body.interests;
  console.log(interests);
  console.log(typeof(interests));
  var findUser = users.find(function(user) {
    if(user.UserId == userId){
      return user;
    }
    return;
  });
  if(findUser) {
    // interests.forEach(function(element){
    //   console.log(element);
    // });
    findUser.interests = interests; 
    res.status(200).send(findUser);
  } else {
    res.status(404).send({'error': 'Invalid userId. Please try again'});
  }

});

/* Get suggested events for a user */
server.post('/mysuggestions', function (req, res) {
  console.log('POST /mysuggestions called');
    var userId = escape(req.body.userId);
    var communityName = req.body.communityName;
    console.log('userId '+ userId + ' community Name: '+ communityName);
    var count = 0;
    var desiredUser = users.find(function (user) {
        return user.UserId == userId;
    });
    var userInterests = desiredUser.interests || [];
    var searchMatchingEvents = events.filter( function(event) {
      return event.EventCommName == communityName && userInterests.some(v => event.EventName.toLowerCase().includes(v.toLowerCase())) && ++count < 10;
    });
    if(searchMatchingEvents) {
      res.status(200).send(searchMatchingEvents);
    } else {
      res.status(200).send({'error': 'Sorry, couldn\'t find any results.'});
    } 
});

/* Basic site search will return events or community centers */
server.get('/search', function (req, res) {
    console.log('GET /search called');
    var communityName= unescape(req.query.communityName);
    var searchTerm = escape(req.query.term);
    console.log('searchterm '+ searchTerm + ' community Name: '+ communityName);
    var count = 0;
    var searchMatchingEvents = events.filter( function(event) {
      return event.EventCommName == communityName && event.EventName.toLowerCase().includes(searchTerm.toLowerCase()) && ++count < 10;
    });
    if(searchMatchingEvents) {
      res.status(200).send(searchMatchingEvents);
    } else {
      res.status(200).send({'error': 'Sorry, couldn\'t find any results.'});
    }    
});

/* Register for an event */
server.post('/registerForEvent', function (req, res) {
  console.log('POST /registerForEvent called');
  var eventId = escape(req.body.eventId);
  var userId = escape(req.body.userId);

  console.log('Param Name: Event ID: ' + userId);
  var desiredEvent = events.find( function(event) {
    return event.EventID == eventId;
  });
  if(desiredEvent) {
    desiredEvent.attendees = desiredEvent.attendees || []; 
    var length = desiredEvent.attendees.length;
    desiredEvent.attendees[length] = userId;

    for(var i= 0; i< users.length; i++){
      if(users[i].UserId == userId){
        users[i].registeredEvents = users[i].registeredEvents || [];
        var numEvents = users[i].registeredEvents.length;
        users[i].registeredEvents[numEvents] = eventId;
        console.log(JSON.stringify(users[i]));
        break;
       }
    }

    res.status(200).send({'success': 'Registration Complete.'});
  } else {
    res.status(200).send({'error': 'No such event found.'});
  }
});

