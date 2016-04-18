var _ = require('lodash');

var rssi = require('./rssi');

var kalman1d = require('./kalman').kalman1d;
var outlier = require('./filters/outlier');
var MA = require('./filters/movingAverage');
var ED = require('./filters/expDamping');
var WMA = require('./filters/weightedMovingAverage');

module.exports = Ball;

var movingAveragePeriod = 3;
var movingAverageWeights = [ 0.1, 0.2, 0.7 ];

var NEAR_THRESHOLD_LOW = 0.3;
var NEAR_THRESHOLD_HIGH = 0.4;

function Ball(color, id) {
    this.color = color;
    this.distances = {};
    this.outlier = {};
    this.acceleration = 0;
    this.filters = {
        acceleration: MA(movingAveragePeriod)
    };
    this.ballId = id;
    this.affectingTimestamp = 0;

    this.neighbors = new Set();
}

Ball.prototype.updateMeasurement = function(data) {
    var self = this;

    // TODO: this is because the sensors are sending these data on the rssi
    // this.distances = data.rssi;
    this.rssi = _.cloneDeep(data.rssi);

    var distances = data.rssi;

    _.forOwn(distances, function(value, id) {
        if (!self.filters[id]) {
            // R: process noise; how noisy our system internally is
            // Q: measurement noise; how noisy the measurements are
            self.filters[id] = kalman1d({R: 0.01, Q: 0.1});
            // self.filters[id] = MA(movingAveragePeriod);
        }

        // if the rssi value is not valid, don't update it
        if (!rssi.isValid(value))
            return;

        // convert rssi to distance
        value = rssi.toDistance(value);

        if (!self.outlier[id]) {
            self.outlier[id] = outlier(10);
        }

        if (!self.outlier[id].isOutlier(value)) {
            // no filtering
            // self.distances[id] = value;

            // filtering
            var filteredDistance = self.filters[id].filter(value);
            self.distances[id] = filteredDistance;


            if (0 < filteredDistance &&
                filteredDistance < NEAR_THRESHOLD_LOW) {
                self.neighbors.add(id);
            }
            else if (filteredDistance > NEAR_THRESHOLD_HIGH) {
                self.neighbors.delete(id);
            }
        }

        self.outlier[id].push(value);
    });

    this.acceleration = this.filters.acceleration.filter(
        data.acceleration);
};

Ball.prototype.isNeighbor = function(otherBallId) {
    return this.neighbors.has(otherBallId);
};

Ball.prototype.getNeighbors = function() {
    return this.neighbors;
};

Ball.prototype.getColor = function(color) {
    var c = this.color;
    return [c[0], c[1], c[2]];
};

Ball.prototype.updateColor = function(color) {
    this.color = color;
};
