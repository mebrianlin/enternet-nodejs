var kalman = require('./kalman');

module.exports = Ball;

function Ball(color) {
    this.color = color;
    this.distances = {};
    this.acceleration = 0;
    this.filters = {};
    // this.kalman = kalman();
}

Ball.prototype.updateMeasurement = function(data) {
    // TODO: this is because the sensors are sending these data on the rssi
    // this.distances = data.rssi;
    var rssi = data.rssi;
    for (var id in rssi) {
        if (rssi.hasOwnProperty(id)) {
            // if (!this.filters[id]) {
            //     this.filters[id] = kalman.kalman1d();
            // }
            // this.distances[id] = this.filters[id].filter(rssi[id]);
            this.distances[id] = rssi[id];
        }
    }
    this.acceleration = data.acceleration;
    // this.acceleration = this.kalman.filter(0, 1, 2);
};
