var app = angular.module('root', ['ngMaterial']);

app.controller('index', ['$scope', '$http', '$window', function ($scope, $http, $window) {

    $scope.title = 'City of San Jose: Parks';

    $scope.user = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    };

    $scope.communities = [];
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

    $scope.communityEvents = [];

    $scope.communitySelected = function (selectedCommunity) {
        console.log('Comunity selected: ' + selectedCommunity);
        loadCommunityEvents(selectedCommunity);
    };

    loadCommunityEvents = function (selectedCommunity) {
        console.log('Loading the community Events for community: ' + selectedCommunity);
        $http.get('community-events?communityName=' + selectedCommunity).then(function (data) {
            // console.log('DATA: ' + JSON.stringify(data));
            $scope.communityEvents = data.data;
        }, function (err) {
            console.log("Error geting value from the community events API.");
        });
    }

    $scope.search = function (term) {
        console.log('Search called for: ' + term);
    }

}]);