var ballManager = require('../ballManagerClient');
var color = require('../../color');
var kalman1d = require('../../kalman').kalman1d;

module.exports = {
    update: update,
    getFilters: getFilters
};

var STATION_ID = 1;
var MAX_DISTANCE = 1;

function update(ballId) {
    if (ballId == STATION_ID)
        return;

    try {
        var balls = ballManager.getBalls();
        var d_stationToBall = balls[STATION_ID].getDistance(ballId);
        var d_ballToStation = balls[ballId].getDistance(STATION_ID);
        var d = (d_stationToBall + d_ballToStation) / 2;
        var ratio = Math.min(d / MAX_DISTANCE, 1);
        var newColor = [ratio * 100, (1 - ratio) * 100, 0];

        ballManager.changeColor(ballId, newColor);
    }
    catch (ex) {

    }
}

function getFilters() {
    return {
        acceleration: kalman1d({R: 0.01, Q: 0.01}),
        distance: kalman1d({R: 0.01, Q: 0.1})
    };
}
