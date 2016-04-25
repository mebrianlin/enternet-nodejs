var _ = require('lodash');

var ballManager = require('../ballManagerClient');
var color = require('../../color');
var noFilter = require('../../filters/noFilter');
var kalman1d = require('../../kalman').kalman1d;

module.exports = {
    update: update,
    getFilters: getFilters
};

var colors = [
    color.Blue,
    color.Yellow,
    color.Green,
    color.Red,
    color.Purple
];

function update(ballId) {
    var numNeighbor = 0;
    try {
        var balls = ballManager.getBalls();

        _.forOwn(balls, function(ball, id) {
            if (ball.isNeighbor(ballId) || balls[ballId].isNeighbor(id))
                ++numNeighbor;
        });
        ballManager.changeColor(ballId, colors[numNeighbor]);

        // var neighbors = balls[ballId].getNeighbors();
        // ballManager.changeColor(ballId, colors[neighbors.size]);

    }
    catch (ex) {

    }
}

function getFilters() {
    return {
        acceleration: kalman1d({R: 0.01, Q: 0.01}),
        distance: noFilter()
    };
}
