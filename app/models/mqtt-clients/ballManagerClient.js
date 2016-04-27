var mqtt = require('mqtt');
var _ = require('lodash');
var fs = require('fs');

var activityManager = require('./activityManagerClient');
var Ball = require('../ball');
var color = require('../color');
var logger = require('../logger');

var subscribeToTopic = 'ball/put/#';
var publishToTopic = 'ball/get';
var BALL_UPDATE_INTERVAL = 400; // default to 200

module.exports = {
     enabled: true,
     connect: connect,
     end: end,
     getBalls: getBalls,
     changeColor: changeColor,
     getRecord: getRecord,
     getRecords: getRecords,
     updateRecord: updateRecord,
     publish: publish
};

var client;
var balls = {};
var records = {

};
readRecord();

function getBalls() {
    return balls;
}

function connect(url, options) {
    client = mqtt.connect(url, options);

    client.on('connect', onConnect);
    client.on('message', updateBallData);
}

function end() {
    if (client) {
        client.end();
    }
}

function onConnect() {
    client.subscribe(subscribeToTopic);
    loop();
}

var ballColorUpdater = updateBallColor();

function loop() {
    var period = BALL_UPDATE_INTERVAL;
    pushAllColor();
    setTimeout(loop, period);

    // var numBalls = _.size(balls) || 1;
    // var period = BALL_UPDATE_INTERVAL / numBalls;

    // ballColorUpdater.next();
    // setTimeout(loop, period);
}

function* updateBallColor() {
// var i = 1;
// while (true) { console.log(i++); yield;}
    while (true) {
        if (_.isEmpty(balls))
            yield;
        else {
            for (var id in balls) {
                if (balls.hasOwnProperty(id)) {
                    pushColor(id, balls[id].color);
                    yield;
                }
            }
        }
    }
}

function updateBallData(topic, message) {
    var str = message.toString();

    // TODO: forcefully fix malformed JSON, should fix it from the device side
    str = str.replace(' }}', '\"}}');
    var ballData = JSON.parse(str);
    var ballId = ballData.id;

    if (!balls[ballId]) {
        balls[ballId] = new Ball(color.Red, ballId,
            activityManager.getCurrentActivity().getFilters);
        // synchronoize the color on initializatoin
        changeColor(ballId, color.Red);
    }

    balls[ballId].updateMeasurement(ballData);
}

// forcefully publish the color without updating the ball
function pushColor(ballId, ballColor) {
    if (client) {
        client.publish(publishToTopic + ballId,
            color.getPublishableColor(ballId, ballColor),
            { qos: 1 });
    }
}

function pushAllColor() {
    _.forOwn(balls, function(ball, id) {
        pushColor(id, ball.color);
    });
}

function changeColor(ballId, ballColor) {
    for (var i = 0; i < ballColor.length; ++i) {
        ballColor[i] = Math.min(ballColor[i], 255);
        ballColor[i] = Math.max(ballColor[i], 0);
    }
    if (!balls[ballId]) {
        balls[ballId] = new Ball(ballColor, ballId,
            activityManager.getCurrentActivity().getFilters);
    }
    balls[ballId].updateColor(ballColor);
    // pushColor(ballId, ballColor);
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

function publish(topic, message) {
    // this is super ugly, as it is hard to track who publishes to what
    if (client) {
        client.publish(topic, message);
    }
}
