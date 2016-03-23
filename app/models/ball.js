var kalman = require('./kalman');

module.exports = Ball;

function Ball() {
    this.distances = {};
    this.color = '';
    this.acceleration = 0;
    // this.kalman = kalman;
    // console.log(kalman());
}

Ball.prototype.update = function(data) {
    this.distances = data.distances;
    this.acceleration = data.acceleration;
};