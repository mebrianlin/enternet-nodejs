angular.module('mqttCtrl', [])
.controller('mqttController', ['$scope', '$window', function($scope, $window) {
    $scope.subscribedMsgs = [];
    $scope.publishTopic = $scope.subscribedTopic = '/example';
    var subscribedTopic = '';

    $scope.mqttBrokers = $window.mqttBrokers;
    var client;

    $scope.selectBroker = function(broker) {
        $scope.mqttBroker = broker;
        console.log(broker);
    };

    function connect(url) {
        if (client)
            client.end();
        client = mqtt.connect(url);
        client.on("message", function(topic, payload) {
            console.log([topic, payload].join(': '));
            $scope.$apply(function() {
                $scope.subscribedMsgs.push(payload.toString());
            });
            // console.log(client.unsubscribe);
            // client.end();
        });
    }

    // var client = mqtt.connect('ws://localhost:3000');
    // var client = mqtt.connect('ws://test.mosquitto.org:8080/mqtt');
    // var client = mqtt.connect('ws://try:try@broker.shiftr.io');

    // client.on("message", function(topic, payload) {
    //     console.log([topic, payload].join(': '));
    //     $scope.$apply(function() {
    //         $scope.subscribedMsgs.push(payload.toString());
    //     });
    //     // console.log(client.unsubscribe);
    //     // client.end();
    // });

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
