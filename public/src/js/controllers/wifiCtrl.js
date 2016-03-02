angular.module('wifiCtrl', [])
.controller('wifiController', ['$scope', function($scope) {
    $scope.subscribedTopic = 'mqtt/demo';
    var subscribedTopic = '';

    // var client = mqtt.connect('ws://localhost:3000');
    // var client = mqtt.connect('ws://test.mosquitto.org:8080/mqtt');
    // var client = mqtt.connect('ws://broker.shiftr.io:80/mqtt');
    var client = mqtt.connect('broker.shiftr.io:80', {
        // clientId: 'javascript'
        username: 'try',
        passwd: 'try'
    });

    client.on('message', function(topic, payload) {
        console.log([topic, payload].join(': '));
        $scope.$apply(function() {
            $scope.subscribedMsg = payload.toString();
            // set to 0 if falsy
            $scope.percentage = parseFloat($scope.subscribedMsg) || 0;
        });
        // client.end();
    });

    $scope.subscribe = function(topic) {
        if (subscribedTopic)
            client.unsubscribe(subscribedTopic);
        subscribedTopic = topic;
        client.subscribe(topic);
    };
}]);
