var _ = require('lodash');

var recordManager = require('../mqtt-clients/recordManagerClient');
var color = require('../color');

module.exports = {
    update: update
};

var moving = {};

var HIGH_THRESHOLD = 12;
var LOW_THRESHOLD = 8;
var MAX_RECORDS = 10;
var MIN_TIME = 1000; // need to be at least 1000 ms
var lastBelowThresholdTime = {};

function update(balls) {
    _.forOwn(balls, function(ball, id) {
        updateBall(balls, id);
    });
}

function updateBall(balls, ballId) {
    var ball = balls[ballId];
    try {
        var a = ball.acceleration;

        if (a < LOW_THRESHOLD) {
            ball.updateColor(color.Green);
            if (!lastBelowThresholdTime[ballId]) {
                lastBelowThresholdTime[ballId] = Date.now();
            }
        }
        else {
            ball.updateColor(color.Black);
            if (lastBelowThresholdTime[ballId]) {
                var time = Date.now() - lastBelowThresholdTime[ballId];
                delete lastBelowThresholdTime[ballId];

                // if (time < MIN_TIME) {
                //     return;
                // }

                console.log('BallID ' + ballId + ' below threshold for ');
                console.log(time);

                // update record
                var record = recordManager.getRecord('acceleration');

                if (!record)
                    record = [];

                var i = 0;
                for (i = 0; i < record.length; ++i) {
                    if (time > record[i]) {
                        record.splice(i, 0, time);
                        break;
                    }
                }
                if (i === record.length) {
                    record.push(time);
                }
                if (record.length > MAX_RECORDS) {
                    record.pop();
                }
                console.log('Rank: ' + (i + 1));
console.log(record);
                recordManager.updateRecord('acceleration', record);
                recordManager.publishRecord('leaderboard/acceleration', JSON.stringify({
                    rank: (i + 1),
                    records: record
                }));
            }
        }

    }
    catch (ex) {

    }
}
