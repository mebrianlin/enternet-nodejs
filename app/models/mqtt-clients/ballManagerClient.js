var mqtt = require('mqtt');
var _ = require('lodash');
var fs = require('fs');

var Ball = require('../ball');
var color = require('../color');
var logger = require('../logger');

var subscribeToTopic = 'ball/put/#';
var publishToTopic = 'ball/get';

module.exports = {
     enabled: true,
     connect: connect,
     end: end,
     getBalls: getBalls,
     changeColor: changeColor,
     publishColor: publishColor,
     getRecord: getRecord,
     getRecords: getRecords,
     updateRecord: updateRecord
};

var ballHandlers = [];
// connect all the mqtt clients
var fs = require('fs');
var path = require('path');
var normalizedPath = path.join(__dirname, 'ball-handlers');

var mqttClientCount = 0;
fs.readdirSync(normalizedPath).forEach(function(file) {
    if (!fs.statSync(path.join(normalizedPath, file)).isFile()) {
        return;
    }
    var handler = require(path.join(normalizedPath, file));
    if (handler.enabled) {
        logger.info('Enabling client ' + file);
        ballHandlers.push(handler);
        ++mqttClientCount;
    }
});
if (mqttClientCount > 1) {
    logger.warn(mqttClientCount + ' mqtt clients are enabled at the same time');
}

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
    client.on('message', ballHandler);
}

function end() {
    if (client) {
        client.end();
    }
}

function onConnect() {
    client.subscribe(subscribeToTopic);

    for (var i = 0; i < ballHandlers.length; ++i) {
        if (ballHandlers[i].init)
            ballHandlers[i].init();
    }
    // loop();
}

function loop() {
    var numBalls = _.size(balls) || 1;
    var period = 2000 / numBalls;

    var iterator = updateOneBall();
    iterator.next();
    setTimeout(loop, period);
}

function* updateOneBall() {
var i = 1;
while (true) { console.log(i++); yield;}
    while (true) {
        if (_.isEmpty(balls))
            yield;
        else {
            for (var id in balls) {
console.log(id);
                if (balls.hasOwnProperty(id)) {
                    // publishColor(id, balls[id].color);
                    yield;
                }
            }
        }
    }
}

function ballHandler(topic, message) {
    var str = message.toString();
// console.log(str);
    // TODO: forcefully fix malformed JSON, should fix it from the device side
    str = str.replace(' }}', '\"}}');
    var ballData = JSON.parse(str);

    var ballId = ballData.id;
    if (!balls[ballId]) {
        balls[ballId] = new Ball();
        // synchronoize the color on initializatoin
        changeColor(ballId, color.Red);
    }

    balls[ballId].updateMeasurement(ballData);

    for (var i = 0; i < ballHandlers.length; ++i) {
        if (ballHandlers[i].update)
            ballHandlers[i].update(ballId);
    }
}

// forcefully publish the color without updating the ball
function publishColor(ballId, ballColor) {
    if (client) {
        client.publish(publishToTopic + ballId,
            color.getPublishableColor(ballId, ballColor),
            { qos: 1 });
    }
}

function changeColor(ballId, ballColor) {
    for (var i = 0; i < ballColor.length; ++i) {
        ballColor[i] = Math.min(ballColor[i], 255);
        ballColor[i] = Math.max(ballColor[i], 0);
    }
    balls[ballId].updateColor(ballColor);
    publishColor(ballId, ballColor);
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
    var text = JSON.stringify(record);
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
