var ballManager = require('../ballManagerClient');
var color = require('../../color');

module.exports = {
    update: update
};

var moving = {

};

var HIGH_THRESHOLD = 12;
var LOW_THRESHOLD = 8;
var MAX_RECORDS = 10;
var MIN_TIME = 1000; // need to be at least 1000 ms
var lastBelowThresholdTime = {

};

function update(ballId) {
    try {
        var balls = ballManager.getBalls();

        var a = balls[ballId].acceleration;
        // if (a > HIGH_THRESHOLD) {
        //     if (!moving[ballId]) {
        //         // ballManager.changeColor(ballId, color.getRandomColor());
        //         ballManager.changeColor(ballId, color.Blue);
        //         moving[ballId] = true;
        //     }
        // }
        // else {
        //     ballManager.changeColor(ballId, color.Black);
        //     moving[ballId] = false;
        // }

        if (a < LOW_THRESHOLD) {
            ballManager.changeColor(ballId, color.Green);
            if (!lastBelowThresholdTime[ballId]) {
                lastBelowThresholdTime[ballId] = Date.now();
            }
        }
        else {
            ballManager.changeColor(ballId, color.Black);
            if (lastBelowThresholdTime[ballId]) {
                var time = Date.now() - lastBelowThresholdTime[ballId];
                delete lastBelowThresholdTime[ballId];

                // if (time < MIN_TIME) {
                //     return;
                // }

                console.log('BallID ' + ballId + ' below threshold for ');
                console.log(time);

                // update record
                var record = ballManager.getRecord('acceleration');

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
                ballManager.updateRecord('acceleration', record);
                ballManager.publish('leaderboard/acceleration', JSON.stringify({
                    rank: (i + 1),
                    records: record
                }));
            }
        }

    }
    catch (ex) {

    }
}
