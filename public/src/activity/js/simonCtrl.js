app.register
.controller('simonController', ['$scope', '$http', '$interval', function($scope, $http, $interval) {
    // this is ugly, and is just for soft
    // code is duplicated here, should browserify color.js
    // or call the server to get the required colors
    var allColors = [
        [255,   0,   0],
        [  0, 255,   0],
        [  0,   0, 255],
        [255, 255,   0],
        [182, 67, 223]
    ];

    var targetColorIndex = -1;
    getNewTargetColor();

    function checkColor(balls) {
        if (_.isEmpty(balls))
            return;

        // convert the color to css style
        _.forOwn(balls, function(ball, id) {
            var color = ball.color;
            var targetColor = allColors[targetColorIndex];
            if (color[0] == targetColor[0] &&
                color[1] == targetColor[1] &&
                color[2] == targetColor[2])
                // ok
                getNewTargetColor();

        });
    }

    $scope.$watch(
        function(scope) {
            return scope.ballData;
        },
        function(newValue, oldValue) {
            checkColor(newValue);
        }
    );

    // $scope.$watch(
    //     function(scope) {
    //         return scope.ballColor;
    //     },
    //     function(newValue, oldValue) {
    //         console.log(oldValue, newValue);
    //     }
    // );

    $scope.getNewTargetColor = getNewTargetColor;
    function getNewTargetColor() {
        ++targetColorIndex;
        if (targetColorIndex >= allColors.length) {
            targetColorIndex = 0;
        }
        $scope.targetColor = convertToCssColor(allColors[targetColorIndex]);
    }

    function convertToCssColor(color) {
        return 'rgb(' + color[0] + ',' +
            color[1] + ',' + color[2] + ')';
    }
}]);