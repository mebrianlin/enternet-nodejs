angular.module('mainCtrl', ['ui.bootstrap', 'ngRoute'])
.controller('mainController', ['$scope', '$interval', '$http',
    function($scope, $interval, $http) {

        // $scope.simonCtrl = $injector.get('simonCtrl');

    var updateInterval = 100;

    $scope.title = 'EnterNet IoT';
    $scope.tagline = '';

    $scope.tabs = [];

    function toSentenceCase(camelCase) {
        var result = camelCase.replace(/([A-Z])/g, ' $1');
        // capitalize the first letter
        return result.charAt(0).toUpperCase() + result.slice(1);
    }

    $http.get('/api/activity/get')
    .then(function(data) {
        var activities = data.data;
        activities.forEach(function(a) {
            $scope.tabs.push({
                link: '/activity/' + a,
                title: toSentenceCase(a),
                activity: a
            });
        });
    });

    $scope.changeActivity = function(name) {
        if (name) {
            $http.get('/api/activity/change/' + name);
        }
    };

    $scope.convertToCssColor = function(color) {
        return 'rgb(' + color[0] + ',' +
            color[1] + ',' + color[2] + ')';
    };

    var updateBallId = $interval(function() {
        $http.get('/api/balls/get')
        .then(function(data) {
            var balls = data.data;
            $scope.ballData = balls;
        });
    }, updateInterval);

    $scope.$on('$destroy', function() {
        if (updateBallId) {
            $interval.cancel(updateBallId);
        }
    });
}]);
