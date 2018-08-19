var app = angular.module('root', ['ngMaterial']);

app.controller('index', ['$scope', '$http', '$window', function ($scope, $http, $window) {

    // var thisCtrl = this;

    // this.getData = function() {
    //     this.route = 'data/communities.json';
    //     $http.get(thisCtrl.route)
    //         .success(function (data) {
    //             console.log(data);
    //         })
    //         .error(function (data) {
    //             console.log("Error getting data from " + thisCtrl.route);
    //         });
    // }

    $scope.title = 'City of San Jose: Parks';

    $scope.communities = [];

    $scope.communities = [{ "name": "Community 1", "location": "abc" }, { "name": "Community 2", "location": "def" }];

    $scope.communityEvents = [{ "name": "Kayaking", "location": "Willow Lake, San Jose" }, { "name": "Soccer Game", "location": "Lee Fields, San Jose" }];

    $scope.communitySelected = function (selectedCommunity) {
        console.log('Comunity selected: ' + selectedCommunity);
        // call api or something to fetch the events of this community.
        // and then, set the $scope.
    };

    $scope.search = function (term) {
        console.log('Search called for: ' + term);
    }

}]);