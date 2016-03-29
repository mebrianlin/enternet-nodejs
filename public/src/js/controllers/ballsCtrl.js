angular.module('ballsCtrl', ['chart.js', 'n3-line-chart'])
.controller('ballsController', ['$scope', '$http', '$interval', function($scope, $http, $interval) {

       $scope.data = {
         dataset0: [
           {x: 0, val_0: 0, val_1: 0, val_2: 0, val_3: 0},
           {x: 1, val_0: 0.993, val_1: 3.894, val_2: 8.47, val_3: 14.347},
           {x: 2, val_0: 1.947, val_1: 7.174, val_2: 13.981, val_3: 19.991},
           {x: 3, val_0: 2.823, val_1: 9.32, val_2: 14.608, val_3: 13.509},
           {x: 4, val_0: 3.587, val_1: 9.996, val_2: 10.132, val_3: -1.167},
           {x: 5, val_0: 4.207, val_1: 9.093, val_2: 2.117, val_3: -15.136},
           {x: 6, val_0: 4.66, val_1: 6.755, val_2: -6.638, val_3: -19.923},
           {x: 7, val_0: 4.927, val_1: 3.35, val_2: -13.074, val_3: -12.625}
         ]
       };

       $scope.options = {
         series: [
           {
             axis: "y",
             dataset: "dataset0",
             key: "val_1",
             label: "An area series",
             color: "#1f77b4",
             type: ['line', 'dot'],
             id: 'mySeries0'
           }
         ],
         axes: {x: {key: 'x'}}
       };

    var LENGTH = 10;

    var accelerationLabels = _.times(LENGTH, _.constant(0));
    var accelerationSeries = [];
    var accelerationData = [];
    var distanceLabels = [];
    var distanceData = [];

    $interval(function() {
        $http.get('/api/balls/get')
        .then(function(data) {

            var balls = data.data;
            console.log(balls);

            accelerationSeries = [];
            for (var bId in balls) {
                if (balls.hasOwnProperty(bId)) {

                    accelerationLabels.shift();
                    accelerationLabels.push(Date.now());

                    accelerationSeries.push(bId);

                    if (!accelerationData[bId])
                        accelerationData[bId] = _.times(LENGTH, _.constant(0));

                    accelerationData[bId].shift();
                    accelerationData[bId].push(balls[bId].acceleration);
                }

                var distances = balls[bId].distances;
                for (var dId in distances) {
                    if (distances.hasOwnProperty(dId)) {
                        distanceLabels.push(bId + '->' + dId);
                        distanceData.push(distances[dId]);
                    }
                }
            }
            $scope.accelerationLabels = accelerationLabels;
            $scope.accelerationSeries = accelerationSeries;

            $scope.accelerationData = [];
            for (var l in accelerationSeries) {
                if (accelerationSeries.hasOwnProperty(l)) {
                    $scope.accelerationData.push(accelerationData[accelerationSeries[l]]);
                }
            }

            $scope.distanceLabels = distanceLabels;
            $scope.distanceData = distanceData;

            console.log(accelerationLabels);
            console.log(accelerationSeries);
            console.log(accelerationData);
        });
    }, 500);

    // $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    // $scope.series = ['Series A', 'Series B'];
    // $scope.data = [
    //     [65, 59, 80, 81, 56, 55, 40],
    //     [28, 48, 40, 19, 86, 27, 90]
    // ];
    // $scope.onClick = function (points, evt) {
    //     console.log(points, evt);
    // };

    // var LENGTH = 10;

    // var accelerationLabels = _.times(LENGTH, _.constant(0));
    // var accelerationSeries = [];
    // var accelerationData = [];
    // var distanceLabels = [];
    // var distanceData = [];

    // $interval(function() {
    //     $http.get('/api/balls/get')
    //     .then(function(data) {

    //         var balls = data.data;

    //         accelerationSeries = [];
    //         for (var bId in balls) {
    //             if (balls.hasOwnProperty(bId)) {

    //                 accelerationLabels.shift();
    //                 accelerationLabels.push(Date.now());

    //                 accelerationSeries.push(bId);

    //                 if (!accelerationData[bId])
    //                     accelerationData[bId] = _.times(LENGTH, _.constant(0));

    //                 accelerationData[bId].shift();
    //                 accelerationData[bId].push(balls[bId].acceleration);
    //             }

    //             var distances = balls[bId].distances;
    //             for (var dId in distances) {
    //                 if (distances.hasOwnProperty(dId)) {
    //                     distanceLabels.push(bId + '->' + dId);
    //                     distanceData.push(distances[dId]);
    //                 }
    //             }
    //         }
    //         $scope.accelerationLabels = accelerationLabels;
    //         $scope.accelerationSeries = accelerationSeries;

    //         $scope.accelerationData = [];
    //         for (var l in accelerationSeries) {
    //             if (accelerationSeries.hasOwnProperty(l)) {
    //                 $scope.accelerationData.push(accelerationData[accelerationSeries[l]]);
    //             }
    //         }

    //         $scope.distanceLabels = distanceLabels;
    //         $scope.distanceData = distanceData;

    //         console.log(accelerationLabels);
    //         console.log(accelerationSeries);
    //         console.log(accelerationData);
    //     });
    // }, 500);

    $scope.changeColor = function() {
        throw new Error('Color change is not implemented.');
    };

    $scope.$watch(
        function(scope) {
            return scope.ballColor;
        },
        function(newValue, oldValue) {
            console.log(oldValue, newValue);
        }
    );

    $scope.$on('colorpicker-selected', function(event, dataObject) {
        console.log(dataObject.name);
        console.log(dataObject);
    });

    $scope.$on('colorpicker-mousemove', function(event, dataObject) {
        console.log('mousemove');
        console.log(dataObject);
    });
}]);