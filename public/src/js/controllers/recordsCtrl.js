// var url = 'ws://try:try@broker.shiftr.io:80';
var url = 'ws://localhost:3000';
var subscribeToTopic = 'leaderboard/acceleration';

angular.module('recordsCtrl', [])
.controller('recordsController', ['$scope', '$http', function($scope, $http) {
    $http.get('/api/records/get')
    .then(function(data) {
        $scope.records = data.data.acceleration;
    });
    var client = mqtt.connect(url, {
        clientId: 'frontend_recordsCtrl' + Math.random().toString().slice(-6)
    });

    client.on('connect', function(connack) {
        console.log('connect');
        client.subscribe('leaderboard/acceleration');
    });
    client.on('message', function(topic, payload) {
        var str = payload.toString();
        var data = JSON.parse(str);
console.log(data);
        $scope.$apply(function() {
            $scope.rank = data.rank;
            $scope.records = data.records;
        });
    });

    $scope.$on('$destroy', function() {
        if (client) {
            client.end();
        }
    });
}]);
