var app = angular.module('root', ['ngMaterial']);

app.controller('index', ['$scope', '$http', '$window', function ($scope, $http, $window) {

    $scope.title = 'City of San Jose: Parks';

    $scope.communities = [];
    $http.get('data/communities.json').then(function (data) {
        // console.log('DATA: ' + JSON.stringify(data));
        $scope.communities = data.data;
    }, function (err) {
        console.log("Error getting data from the communities JSON file.");
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
        console.log('Loading the community Events');
        $http.get('community-events?community=' + selectedCommunity).then(function (data) {
            // console.log('DATA: ' + JSON.stringify(data));
            $scope.communityEvents = data.data;
        }, function (err) {
            console.log("Error getting data from the communities JSON file.");
        });
    }

    $scope.search = function (term) {
        console.log('Search called for: ' + term);
    }


    // Categories
    //$scope.items = [{"category":"sports", "img":"./img/img3.jpeg"}, {"category":"dance", "img":"./img/img3.jpeg"}, {"category":"arts", "img":"./img/img3.jpeg"}];
    $scope.items = []
    $http.get('data/categories.json').then(function (response) {
        console.log('DATA: ' + JSON.stringify(response.data[0]));
        $scope.items = response.data;
    }, function (err) {
        console.log("Error getting data from the categories JSON file.");
    });  
    $scope.selected = [];

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

}]);