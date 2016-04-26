angular.module('mainCtrl', ['ui.bootstrap'])
.controller('mainController', ['$scope', '$interval', '$http',
    function($scope, $interval, $http) {
    $scope.title = 'EnterNet IoT';
    $scope.tagline = 'Let the game begin!';

    $scope.tabs = [
        { link: '/http', title: 'HTTP' },
        { link: '/mqtt', title: 'MQTT' },
        { link: '/wifi', title: 'WiFi' },
        { link: '/balls', title: 'Balls' },
        { link: '/records', title: 'Records' },
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
}]);
