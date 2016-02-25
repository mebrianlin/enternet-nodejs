angular.module('httpCtrl', [])
.controller('httpController', ['$scope', function($scope) {
    $scope.title = 'HTTP';
    $scope.tagline = 'HTTP controller';
}]);