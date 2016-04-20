angular.module('ballsCtrl', ['chart.js', 'n3-line-chart'])
.controller('ballsController', ['$scope', '$http', '$interval', function($scope, $http, $interval) {

    var rssiData = [];
    var rssiData2 = [];
    var updateInterval = 100;
    var LENGTH = 50;

    var rssiMetaData = {
        id: [
            { source: 1, target: 2 },
            // { source: 1, target: 3 },
            // { source: 1, target: 5 },
            { source: 2, target: 1 },
            // { source: 2, target: 3 },
            // { source: 2, target: 5 },
            // { source: 3, target: 1 },
            // { source: 3, target: 2 },
            // { source: 3, target: 5 },
            // { source: 5, target: 1 },
            // { source: 5, target: 2 },
            // { source: 5, target: 3 }
        ],
        data: [],
        dataPoints: {}
    };
    var accelerationMetaData = {
        id: [ 1, 2, 3, 4, 5 ],
        data: [],
        dataPoints: {}
    };

    _.forEach(rssiMetaData.id, function(id) {
        var rssiData = [];
        if (_.isEmpty(rssiMetaData.dataPoints[id.source])) {
            rssiMetaData.dataPoints[id.source] = {};
        }
        rssiMetaData.dataPoints[id.source][id.target] = rssiData;

        rssiMetaData.data.push({
            type: 'line',
            dataPoints: rssiData,
            showInLegend: true,
            legendText: id.source + '->' + id.target
        });
    });
    _.forEach(accelerationMetaData.id, function(id) {
        var accelerationData = [];
        accelerationMetaData.dataPoints[id] = accelerationData;

        accelerationMetaData.data.push({
            type: 'line',
            dataPoints: accelerationData,
            showInLegend: true,
            legendText: id.toString()
        });
    });
    // console.log(rssiMetaData);

    var canvasData = rssiMetaData.data;
    var accelerationData = accelerationMetaData.data;

    $scope.charts = [];
    $scope.charts.push(new CanvasJS.Chart('rssiChart', {
        title:{
            text: 'RSSI'
        },
        axisY:{
            title: "Distance",
            interlacedColor: "#F8F1E4",
            // tickLength: 10,
            minimum: 0,
            maximum: 5,
            includeZero: false
        },
        data: canvasData
        // data: [
        //     {
        //         type: 'line',
        //         dataPoints: rssiData,
        //         showInLegend: true,
        //         legendText: '1->2'
        //     },
        //     {
        //         type: 'line',
        //         dataPoints: rssiData2,
        //         showInLegend: true,
        //         legendText: '1->2'
        //     }
        // ]
    }));
    $scope.charts.push(new CanvasJS.Chart('accelerationChart', {
        title:{
            text: 'Acceleration'
        },
        axisY:{
            title: "m/s^2",
            interlacedColor: "#F8F1E4",
            // tickLength: 10,
            minimum: 0,
            maximum: 20,
            includeZero: false
        },
        data: accelerationData
    }));

    renderCharts();
    var t = 0;

    $interval(function() {
        $http.get('/api/balls/get')
        .then(function(data) {
            var balls = data.data;

            if (_.isEmpty(balls))
                return;

            // convert the color to css style
            _.forOwn(balls, function(ball, id) {
                var color = ball.color;
                ball.color = 'rgb(' + color[0] + ',' +
                    color[1] + ',' + color[2] + ')';
            });
            $scope.ballData = balls;

            ++t; // advance the time
            _.forEach(rssiMetaData.id, function(id) {
                if (_.isEmpty(balls[id.source]))
                    return;

                var rssiData = rssiMetaData.dataPoints[id.source][id.target];
                if (rssiData.length > LENGTH)
                    rssiData.shift();
                rssiData.push({
                    x: t,
                    y: balls[id.source].distances[id.target]
                });
            });

            _.forEach(accelerationMetaData.id, function(id) {
                if (_.isEmpty(balls[id]))
                    return;

                var accelerationData = accelerationMetaData.dataPoints[id];
                if (accelerationData.length > LENGTH)
                    accelerationData.shift();
                accelerationData.push({
                    x: t,
                    y: balls[id].acceleration
                });
            });

            renderCharts();
        });
    }, updateInterval);

    function renderCharts() {
        for (var i = 0; i < $scope.charts.length; ++i) {
            $scope.charts[i].render();
        }
    }

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