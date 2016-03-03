angular.module('mqttCtrl', [])
.controller('mqttController', ['$scope', '$window', function($scope, $window) {
    $scope.subscribedMsgs = {};
    $scope.publishTopic = $scope.subscribedTopic = '/etc_get';

    $scope.mqttBrokers = $window.mqttBrokers;
    var client;

    $scope.selectBroker = function(broker) {
        $scope.mqttBroker = broker;
    };

    $scope.connect = function(url) {
        $scope.mqttConnecting = true;
        $scope.disconnect();
        $scope.subscribedMsgs = {};
        client = mqtt.connect(url);
        client.on('message', function(topic, payload) {
            // console.log([topic, payload].join(': '));
            $scope.$apply(function() {
                $scope.subscribedMsgs[topic] = {
                    payload: payload.toString(),
                    time: moment().format('HH:mm:ss')
                };
            });
        });
        client.on('connect', function(connack) {
            $scope.$apply(function() {
                $scope.mqttConnected = true;
                $scope.mqttConnecting = false;
            });
            console.log('connect');
        });
        client.on('close', function(topic, payload) {
            $scope.$apply(function() {
                $scope.mqttConnected = false;
                $scope.mqttConnecting = false;
            });
        });
    };

    $scope.disconnect = function() {
        if (client) {
            client.end();
            client = null;
        }
    };

    $scope.subscribe = function(topic) {
        client.subscribe(topic);
    };

    $scope.publish = function(topic, payload) {
        client.publish(topic, payload);
    };
}]);
