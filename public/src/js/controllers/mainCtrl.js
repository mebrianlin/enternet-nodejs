angular.module('mainCtrl', ['ui.bootstrap'])
.controller('mainController', ['$scope', '$interval', function($scope, $interval) {
    $scope.title = 'EnterNet IoT';
    $scope.tagline = 'Let the game begin!';
}]);
