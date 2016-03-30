// var url = 'ws://try:try@broker.shiftr.io:80';
// var subscribeToTopic = 'ball/pos';
// var publishToTopic = 'ball/wifi';
var url = 'ws://localhost:3000';
var subscribeToTopic = 'ball/pos';
var publishToTopic = 'ball/get';

angular.module('triangleCtrl', [])
.directive('triangleVisualizer', function () {
    return {
        restrict: 'ACE',
        link: function($scope, element) {
            // to object
            var scale = 30;

            var canvas = element[0];
            var ctx = canvas.getContext('2d');

            function clearCanvas() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            function drawCircle(x, y, r) {
                ctx.beginPath();
                ctx.arc(x, y, r, 0, 2 * Math.PI, false);
                // ctx.lineWidth = 5;
                ctx.stroke();
            }

            var client = mqtt.connect(url);

            client.on('connect', function(connack) {
                console.log('connect');
                client.subscribe(subscribeToTopic);
            });
            client.on('message', function(topic, payload) {
                var str = payload.toString();
                // console.log(str);

                var positions = JSON.parse(str);
                clearCanvas();
                drawCircle(100+positions[1].x*scale, 100+positions[1].y*scale, 5);
                drawCircle(100+positions[2].x*scale, 100+positions[2].y*scale, 5);
                drawCircle(100+positions[3].x*scale, 100+positions[3].y*scale, 5);
            });
        }
    };
})
.controller('triangleController', ['$scope', '$interval', function($scope, $interval) {
    // var client = mqtt.connect(url);

    // client.on('connect', function(connack) {
    //     console.log('connect');
    //     $interval(publishMockPositions, 1000);
    // });
    // function publishMockPositions() {
    //     var error = 5;
    //     var positions = {
    //         1: {
    //             x: 0,
    //             y: 0
    //         },
    //         2: {
    //             x: 30,
    //             y: 0
    //         },
    //         3: {
    //             x: 0,
    //             y: 40
    //         }
    //     };
    //     var distances = [];
    //     for (var id1 in positions) {
    //         var d = { id: id1, distances: {} };
    //         for (var id2 in positions) {
    //             if (id1 === id2)
    //                 continue;
    //              d.distances[id2] = getDistance(positions[id1], positions[id2]);
    //         }
    //         distances.push(d);
    //     }

    //     function getDistance(p1, p2) {
    //         var xdiff = p1.x - p2.x;
    //         var ydiff = p1.y - p2.y;
    //         return Math.sqrt(xdiff * xdiff + ydiff * ydiff) +
    //             (Math.random() - 0.5) * error;
    //     }

    //     distances.forEach(function(elem) {
    //         client.publish('ball/wifi', JSON.stringify(elem));
    //     });
    //     // client.publish('ball/wifi', JSON.stringify(distances));
    // }
}]);
