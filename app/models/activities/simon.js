var _ = require('lodash');

var color = require('../color');
var noFilter = require('../filters/noFilter');
var kalman1d = require('../kalman').kalman1d;

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

function update(balls) {
    _.forOwn(balls, function(ball, id) {
        checkNeighbor(balls, id);
    });

}

function checkNeighbor(balls, ballId) {
    var numNeighbor = 0;
    try {
        _.forOwn(balls, function(ball, id) {
            if (ball.isNeighbor(ballId) || balls[ballId].isNeighbor(id))
                ++numNeighbor;
        });
        if (numNeighbor >= colors.length)
            numNeighbor = color.length - 1;
        balls[ballId].updateColor(colors[numNeighbor]);
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
