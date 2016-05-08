var _ = require('lodash');
var color = require('../color');
var kalman1d = require('../kalman').kalman1d;

module.exports = {
    update: update,
    getFilters: getFilters
};

var STATION_ID = 1;
var MAX_DISTANCE = 1;

function update(balls) {
    if (_.isEmpty(balls) || !balls[STATION_ID])
        return;
    _.forOwn(balls, function(ball, id) {
        if (id == STATION_ID)
            ball.updateColor(color.Blue);
        else {
            var d_stationToBall = balls[STATION_ID].getDistance(id);
            var d_ballToStation = ball.getDistance(STATION_ID);
            var d = (d_stationToBall + d_ballToStation) / 2;
            var ratio = Math.min(d / MAX_DISTANCE, 1);
            var newColor = [ratio * 100, (1 - ratio) * 100, 0];

            ball.updateColor(newColor);
        }
    });
}

function getFilters() {
    return {
        acceleration: kalman1d({R: 0.01, Q: 0.01}),
        distance: kalman1d({R: 0.01, Q: 0.01})
    };
}
