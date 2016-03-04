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
            var str = payload.toString();
            var numbers = _(str.split(' ')).map(function(n) {
                var number = parseInt(n);
                if (number || number === 0) {
                   var percentage = number * 100 / 32768 + 50;
                   return {
                       number: number,
                       percentage: percentage
                   };
                }
            }).compact().value();

            $scope.$apply(function() {
                $scope.subscribedMsgs[topic] = {
                    payload: str,
                    time: moment().format('HH:mm:ss'),
                    numbers: numbers
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

    $scope.unsubscribe = function(topic) {
         if ($scope.subscribedMsgs[topic]) {
             client.unsubscribe(topic);
             delete $scope.subscribedMsgs[topic];
         }
    };

    $scope.publish = function(topic, payload) {
        client.publish(topic, payload);
    };
}]);
