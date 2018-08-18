var app = angular.module('root', ['ngMaterial']);

app.controller('index', ['$scope', '$http', '$window', function ($scope, $http, $window) {

    $scope.title = 'City of San Jose: Parks';



    $scope.sampleEvents = [{}, {}];

}]);