app.register
.controller('bowlingController', ['$scope', function($scope) {
    var STATION_ID = 1;

    function updateMinDistance(balls) {
        $scope.minDistanceToOne = null;
        if (_.isEmpty(balls))
            return;
        var minDistance = null;
        _.forOwn(balls, function(ball, id) {
            if (!minDistance || ball.distances[STATION_ID] < minDistance) {
                minDistance = ball.distances[STATION_ID];
            }
        });
        if (minDistance)
            $scope.minDistanceToOne = minDistance;
    }

    $scope.$watch(
        function(scope) {
            return scope.ballData;
        },
        function(newValue, oldValue) {
            updateMinDistance(newValue);
        }
    );
}]);