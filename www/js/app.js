var app = angular.module('root', ['ngMaterial']);

app.controller('index', ['$scope', '$http', '$window', '$mdDialog', '$mdToast', function ($scope, $http, $window, $mdDialog, $mdToast) {

    $scope.title = 'City of San Jose: Parks';
    $scope.sessionUser = undefined;
    $scope.communities = [];
    $scope.communityEvents = [];
    $scope.loginLoading = false;

    $scope.loginEmail = undefined;
    $scope.loginPassword = undefined;

    var filePath = 'data/communities.json';
    $http.get(filePath).then(function (data) {
        // console.log('DATA: ' + JSON.stringify(data));
        $scope.communities = data.data;
        $scope.selectedCommunity = $scope.communities[0].CommCenterName
        $scope.communitySelected($scope.selectedCommunity);
    }, function (err) {
        console.log("Error getting data from the communities JSON file: " + filePath);
    });

    $scope.getLocation = function () {
        console.log('fetching location.');
        if (navigator.geolocation) {
            console.log('geolocation available.');
            navigator.geolocation.getCurrentPosition(function (position) {
                // $scope.$apply(function () {
                    $scope.position = { 'latitude': position.coords.latitude, 'longitude': position.coords.longitude };
                    console.log('Dummy distance: ' + calculatedistance(position.coords.latitude, position.coords.latitude + 10, position.coords.longitude, position.coords.longitude + 10) + ' meters');
                // });
            });
        } else {
            console.log('no geolocation');
            // $scope.$apply(function () {
                $scope.position = 'no geolocation available!';
            // });
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

    $scope.signupAction = function () {
        console.log('Called Signup Action.');
        reqJson = {

        };
        console.log();
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
        $http.get('community-events?communityName=' + selectedCommunity).then(function (data) {
            // $scope.$apply(function () {
                $scope.communityEvents = data.data;
            // });
        }, function (err) {
            console.log("Error geting value from the community events API.");
        });
    };

    var showToast = function (message) {
        $mdToast.show($mdToast.simple().textContent(message).hideDelay(3000));
    };

    $scope.searchEvent = function (term) {
        console.log('Search called for: ' + term);
        $http.get('search?term=' + term).then(function (data) {
            $scope.$apply(function () {
                $scope.communityEvents = data.data;
            });
        }, function (err) {
            console.log("Error geting value from the community events API.");
        });
    };

}]);