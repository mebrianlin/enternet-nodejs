var fs = require('fs');

var activityManager = require('./activityManager');
var Ball = require('./ball');
var color = require('./color');


module.exports = {
     update: update,
     getBalls: getBalls,
     changeColor: changeColor,
     getRecord: getRecord,
     getRecords: getRecords,
     updateRecord: updateRecord
};

var client;
var balls = {};
var records = {

};
readRecord();

function getBalls() {
    return balls;
}

function update(ballId, ballData) {
    if (!balls[ballId]) {
        balls[ballId] = new Ball(color.Red, ballId,
            activityManager.getCurrentActivity().getFilters);
        // synchronoize the color on initializatoin
        changeColor(ballId, color.Red);
    }

    balls[ballId].updateMeasurement(ballData);
}


function changeColor(ballId, ballColor) {
    for (var i = 0; i < ballColor.length; ++i) {
        ballColor[i] = Math.max(Math.min(ballColor[i], 255), 0);
    }
    if (!balls[ballId]) {
        balls[ballId] = new Ball(ballColor, ballId,
            activityManager.getCurrentActivity().getFilters);
    }
    balls[ballId].updateColor(ballColor);
}

function getRecord(key) {
    return records[key];
}

function getRecords() {
    return records;
}

function updateRecord(key, record) {
    records[key] = record;
    // write to file
    var text = JSON.stringify(records);
    fs.writeFile('leaderboard.txt', text, function(err) {
        if (err) {
            console.log(err);
            return;
        }

        console.log('Leaderboard written to file.');
    });
}

function readRecord() {
    // read from file
    fs.readFile('leaderboard.txt', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        try {
            records = JSON.parse(data);
        }
        catch (ex) {
            console.error(ex);
        }
    });
}
