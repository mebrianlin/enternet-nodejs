var kalman = require('./kalman');
var MA = require('./filters/movingAverage');
var ED = require('./filters/expDamping');

module.exports = Ball;

var movingAveragePeriod = 3;

function Ball(color) {
    this.color = color;
    this.distances = {};
    this.acceleration = 0;
    this.filters = {
        acceleration: MA(movingAveragePeriod)
    };
    this.time = Date.now();
    // this.kalman = kalman();
}

Ball.prototype.updateMeasurement = function(data) {
    // TODO: this is because the sensors are sending these data on the rssi
    // this.distances = data.rssi;
    var rssi = data.rssi;
    for (var id in rssi) {
        if (rssi.hasOwnProperty(id)) {
            if (!this.filters[id]) {
                // this.filters[id] = MA(movingAveragePeriod);
                this.filters[id] = ED();
            }
            this.distances[id] = this.filters[id].filter(rssi[id]);

            // this.distances[id] = rssi[id];
        }
    }
    this.acceleration = data.acceleration;
    // this.acceleration = this.kalman.filter(0, 1, 2);

    var currTime = Date.now();
    if (currTime - this.time > 1000)
        console.log(currTime - this.time);
    this.time = currTime;
};

Ball.prototype.updateColor = function(color) {
    this.color = color;
};
