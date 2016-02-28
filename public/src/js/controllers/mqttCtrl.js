angular.module('mqttCtrl', [])
.controller('mqttController', ['$scope', function($scope) {
    $scope.title = 'MQTT';
    $scope.tagline = 'MQTT controller';
    $scope.subscribedMsgs = [];
    $scope.publishTopic = $scope.subscribedTopic = 'mqtt/demo';
    var subscribedTopic = '';

    var client = mqtt.connect('ws://localhost:3000');

    client.on("message", function(topic, payload) {
        console.log([topic, payload].join(': '));
        $scope.$apply(function() {
            $scope.subscribedMsgs.push(payload.toString());
        });
        // console.log(client.unsubscribe);
        // client.end();
    });

    $scope.subscribe = function(topic) {
        if (subscribedTopic)
            client.unsubscribe(subscribedTopic);
        subscribedTopic = topic;
        client.subscribe(topic);
    };
    $scope.publish = function(topic, payload) {
        client.publish(topic, payload);
    };

    $scope.remove = function(index) {
        $scope.subscribedMsgs.splice(index, 1);
    };
}]);
