var app = angular.module('root', ['ngMaterial']);

app.controller('index', ['$scope', '$http', '$window', function ($scope, $http, $window) {

    $scope.title = 'City of San Jose: Parks';



    $scope.sampleEvents = [{}, {}];


    // Categories
    $scope.items = ["Sports", "Dance", "Art"];
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