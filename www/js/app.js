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

    $scope.communityEvents = [];

    $scope.communitySelected = function (selectedCommunity) {
        console.log('Comunity selected: ' + selectedCommunity);
        loadCommunityEvents(selectedCommunity);
        // call api or something to fetch the events of this community.
        // and then, set the $scope.
    };

    loadCommunityEvents = function (selectedCommunity) {
        console.log('Loading the community Events');
        $http.get('community-events?community=' + selectedCommunity).then(function (data) {
            console.log('DATA: ' + JSON.stringify(data));
            $scope.communityEvents = data.data;
        }, function (err) {
            console.log("Error getting data from the communities JSON file.");
        });
    }

    $scope.search = function (term) {
        console.log('Search called for: ' + term);
    }

}]);