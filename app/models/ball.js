var kalman = require('./kalman');

module.exports = Ball;

function Ball(color) {
    this.color = color;
    this.distances = {};
    this.acceleration = 0;
    // this.kalman = kalman();
}

Ball.prototype.updateMeasurement = function(data) {
    // TODO: this is because the sensors are sending these data on the rssi
    this.distances = data.rssi;
    this.acceleration = data.acceleration;
    // this.acceleration = this.kalman.filter(0, 1, 2);
};
