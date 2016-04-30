angular.module('mainCtrl', ['ui.bootstrap'])
.controller('mainController', ['$scope', '$interval', '$http',
    function($scope, $interval, $http) {
    var updateInterval = 200;

    $scope.title = 'EnterNet IoT';
    $scope.tagline = 'Let the game begin!';

    $scope.tabs = [
        { link: '/http', title: 'HTTP' },
        { link: '/mqtt', title: 'MQTT' },
        { link: '/wifi', title: 'WiFi' },
        { link: '/balls', title: 'Balls' },
        { link: '/records', title: 'Records', activity: 'accelerationTest' },
        { link: '/simon', title: 'Simon', activity: 'simon' },
        { link: '/virus', title: 'Virus', activity: 'virus' },
        { link: '/bowling', title: 'Bowling', activity: 'bowling' },
        { link: '/randomcolor', title: 'Random Color', activity: 'randomColor' },
        { link: '/nocolor', title: 'No Color', activity: 'noColor' },
    ];

    $scope.changeActivity = function(name) {
        if (name) {
            $http.get('/api/activity/change/' + name);
        }
    };

    var updateBallId = $interval(function() {
        $http.get('/api/balls/get')
        .then(function(data) {
            var balls = data.data;

            // convert the color to css style
            _.forOwn(balls, function(ball, id) {
                var color = ball.color;
                ball.color = 'rgb(' + color[0] + ',' +
                    color[1] + ',' + color[2] + ')';
            });
            $scope.ballData = balls;
        });
    }, updateInterval);

    $scope.$on('$destroy', function() {
        if (updateBallId) {
            $interval.cancel(updateBallId);
        }
    });
}]);
