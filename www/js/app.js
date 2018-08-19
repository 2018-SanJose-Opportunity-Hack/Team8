var app = angular.module('root', ['ngMaterial', 'LocalStorageModule']);

app.controller('index', ['$scope', '$http', '$window', '$mdDialog', '$mdToast', '$timeout', 'localStorageService', function ($scope, $http, $window, $mdDialog, $mdToast, $timeout, localStorageService) {

    $scope.title = 'City of San Jose: Parks';
    $scope.sessionUser = undefined;
    $scope.communities = [];
    $scope.communityEvents = [];
    $scope.loginLoading = false;
    $scope.signupLoading = false;
    $scope.selectedEvent = undefined;

    $scope.loginEmail = undefined;
    $scope.loginPassword = undefined;
    $scope.signupFirstName = undefined;
    $scope.signupLastName = undefined;
    $scope.signupEmail = undefined;
    $scope.signupPassword = undefined;


    $scope.fetchSession = function() {
        $scope.sessionUser = localStorageService.get('sessionUser');
        $scope.communities = localStorageService.get('communities');
        $scope.communityEvents = localStorageService.get('communityEvents');
        $scope.selectedEvent = localStorageService.get('selectedEvent');
        $scope.selectedCommunity = localStorageService.get('selectedCommunity');

        var invalidAuthPage = $window.location.href.includes('/login.html') || $window.location.href.includes('/signup.html');
        if (invalidAuthPage) {
            $window.location.href = '/index.html';
        }
    }

    var filePath = 'data/communities.json';
    $http.get(filePath).then(function (response) {
        $scope.communities = response.data;
        localStorageService.set('communities', null);
        localStorageService.set('communities', response.data);
        $scope.selectedCommunity = $scope.communities[0].CommCenterName
        localStorageService.set('selectedCommunity', null);
        localStorageService.set('selectedCommunity', $scope.communities[0].CommCenterName);
        $scope.communitySelected($scope.selectedCommunity);
    }, function (err) {
        console.log("Error getting data from the communities JSON file: " + filePath);
    });

    $scope.getLocation = function () {
        console.log('fetching location.');
        if (navigator.geolocation) {
            console.log('geolocation available.');
            navigator.geolocation.getCurrentPosition(function (position) {
                $scope.$apply(function () {
                    $scope.position = { 'latitude': position.coords.latitude, 'longitude': position.coords.longitude };
                    console.log('Dummy distance: ' + calculatedistance(position.coords.latitude, position.coords.latitude + 10, position.coords.longitude, position.coords.longitude + 10) + ' meters');
                });
            });
        } else {
            console.log('no geolocation');
            $scope.$apply(function () {
                $scope.position = 'no geolocation available!';
            });
        }
    }

    if (Number.prototype.toRadians === undefined) {
        Number.prototype.toRadians = function () { return this * Math.PI / 180; };
    }
    /* Ref Calculating distance between pair of (latitude,longitude): https://www.movable-type.co.uk/scripts/latlong.html */
    calculatedistance = function (lat1, lat2, lon1, lon2) {
        var φ1 = lat1.toRadians(), φ2 = lat2.toRadians(), Δλ = (lon2 - lon1).toRadians(), R = 6371e3; // gives d in metres
        var d = Math.acos(Math.sin(φ1) * Math.sin(φ2) + Math.cos(φ1) * Math.cos(φ2) * Math.cos(Δλ)) * R;
        return d;
    }

    $scope.showLogin = function (ev) {
        $mdDialog.show({
            controller: 'index',
            templateUrl: 'login.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        }).then(function (answer) {
        }, function () {
        });
    };

    $scope.showSignUp = function (ev) {
        $mdDialog.show({
            controller: 'index',
            templateUrl: 'signup.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        }).then(function (answer) {
        }, function () {
        });
    };

    $scope.loginAction = function () {
        console.log('Called Login Action.');
        reqJson = {
            "email": $scope.loginEmail,
            "password": $scope.loginPassword
        };
        $scope.loginLoading = true;
        $http.post('login', reqJson, { headers: { 'Content-Type': 'application/json' } }).then(function (response) {
            if (response.data.error) {
                console.log('Error: ' + response.data.error);
                $scope.sessionUser = undefined;
                localStorageService.set('sessionUser', null);
                showToast(response.data.error);
                $scope.loginLoading = false;
            } else {
                console.log('Login Successful ');
                $scope.sessionUser = response.data;
                localStorageService.set('sessionUser', null);
                localStorageService.set('sessionUser', response.data);
                $scope.loginLoading = false;
                showToast("Login SuccessFul! Welcome");
                $mdDialog.hide();
                $timeout(function() {
                    $window.location.href = '/index.html';
                }, 1000);
            }
        }, function (err) {
            console.log("Error geting value from the Login API.");
            $scope.sessionUser = undefined;
            localStorageService.set('sessionUser', null);
            showToast("Error Calling Login API.");
            $scope.loginLoading = false;
        });
    };

    $scope.logout = function() {
        $scope.sessionUser = undefined;
        localStorageService.set('sessionUser', null);
        $window.location.href = '/index.html';
    }

    $scope.signupAction = function () {
        console.log('Called Signup Action.');
        reqJson = {
            "firstname": $scope.signupFirstName,
            "lastname": $scope.signupLastName,
            "email": $scope.signupEmail,
            "password": $scope.signupPassword
        };
        $scope.signupLoading = true;
        $http.post('signup', reqJson, { headers: { 'Content-Type': 'application/json' } }).then(function (response) {
            if (response.data.error) {
                console.log('Error: ' + response.data.error);
                $scope.sessionUser = undefined;
                localStorageService.set('sessionUser', null);
                showToast(response.data.error);
                $scope.signupLoading = false;
            } else {
                console.log('Signup Successful ');
                $scope.sessionUser = undefined;
                localStorageService.set('sessionUser', null);
                $scope.signupLoading = false;
                showToast("Signup SuccessFul! You can login now!");
                $mdDialog.hide();
                $timeout(function() {
                    $window.location.href = '/index.html';
                }, 1000);
            }
        }, function (err) {
            console.log("Error geting value from the Signup API.");
            $scope.sessionUser = undefined;
            localStorageService.set('sessionUser', null);
            showToast("Error Calling Signup API.");
            $scope.signupLoading = false;
        });
    }

    $scope.closeDialog = function () {
        $mdDialog.hide();
    }

    $scope.communitySelected = function (selectedCommunity) {
        console.log('Comunity selected: ' + selectedCommunity);
        loadCommunityEvents(selectedCommunity);
    };

    loadCommunityEvents = function (selectedCommunity) {
        console.log('Loading the community Events for community: ' + selectedCommunity);
        $http.get('community-events?communityName=' + selectedCommunity).then(function (response) {
            $scope.communityEvents = response.data;
            localStorageService.set('communityEvents', null);
            localStorageService.set('communityEvents', response.data);
        }, function (err) {
            console.log("Error geting value from the community events API.");
        });
    };

    var showToast = function (message) {
        $mdToast.show($mdToast.simple().textContent(message).hideDelay(3000));
    };

    $scope.searchEvent = function (term) {
        console.log('Search called for: ' + term);
        $http.get('search?term=' + term).then(function (response) {
            $scope.$apply(function () {
                $scope.communityEvents = response.data;
                localStorageService.set('communityEvents', null);
                localStorageService.set('communityEvents', response.data);
            });
        }, function (err) {
            console.log("Error geting value from the community events API.");
        });
    };


    // Categories
    //$scope.items = [{"category":"sports", "img":"./img/img3.jpeg"}, {"category":"dance", "img":"./img/img3.jpeg"}, {"category":"arts", "img":"./img/img3.jpeg"}];
    $scope.items = []
    $http.get('data/categories.json').then(function (response) {
        console.log('DATA: ' + JSON.stringify(response.data[0]));
        $scope.items = response.data;
    }, function (err) {
        console.log("Error getting data from the categories JSON file.");
    });  
    $scope.selectedInterests = [];

    $scope.toggle = function (item, list) {
    var idx = list.indexOf(item);
    if (idx > -1) {
        list.splice(idx, 1);
    }
    else {
        list.push(item);
    }
    };

    $scope.exists = function (item, list) {
    return list.indexOf(item) > -1;
    };

    $scope.addInterests = function () {
        console.log('Add interests called.');
        reqJson = {
            "userId": $scope.loginEmail,
            "interests": $scope.selected
        };
        $scope.loginLoading = true;
        $http.post('login', reqJson, { headers: { 'Content-Type': 'application/json' } }).then(function (response) {
            if (response.data.error) {
                console.log('Error: ' + response.data.error);
                $scope.sessionUser = undefined;
                showToast(response.data.error);
                $scope.loginLoading = false;
            } else {
                console.log('Login Successful ');
                $scope.sessionUser = response.data;
                $scope.loginLoading = false;
                showToast("Login SuccessFul! Welcome");
                $mdDialog.hide();
            }
        }, function (err) {
            console.log("Error geting value from the Login API.");
            $scope.sessionUser = undefined;
            showToast("Error Calling API.");
            $scope.loginLoading = false;
        });
    };
    $scope.showDetails = function (event) {
        console.log('showing details for event: ' + JSON.stringify(event));
        $scope.selectedEvent = event;
        localStorageService.set('selectedEvent', null);
        localStorageService.set('selectedEvent', event);
        $window.location.href = '/eventDetails.html';
    }
    $scope.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
        'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
        'WY').split(' ').map(function(state) {
        return {abbrev: state};
    });

    $scope.isTextMsg = ('Y N').split(' ').map(function(state) {
        return {abbrev: state};
    });

    $scope.participantArray =
        [{ 'firstName': 'Agniezka', 'lastName': 'Hollan', 'age':'5', 'gender': 'male', 'dob': '2013/01/01' }
        ];

    $scope.addRow = function () {
        console.log("Add Row Called");
        if ($scope.firstName != undefined && $scope.lastName != undefined && $scope.age != undefined && $scope.gender != undefined && $scope.dob != undefined) {
            var participant = [];
            participant.firstName = $scope.firstName;
            participant.lastName = $scope.lastName;
            participant.age = $scope.age;
            participant.gender = $scope.gender;
            participant.dob = $scope.dob;

            $scope.participantArray.push(participant);
            console.log("Pushed to array");
            // CLEAR TEXTBOX.
            $scope.firstName = null;
            $scope.lastName = null;
            $scope.age = null;
            $scope.gender = null;
            $scope.dob = null;
        }else{
            console.log("",$scope.firstName,$scope.lastName,$scope.age,$scope.gender,$scope.dob);
        }
    };

    $scope.removeRow = function () {
        var arrParticipant = [];
        angular.forEach($scope.participantArray, function (value) {
            if (!value.Remove) {
                arrParticipant.push(value);
            }
        });
        $scope.participantArray = arrParticipant;
    };

}]);