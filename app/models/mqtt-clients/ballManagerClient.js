var mqtt = require('mqtt');
var _ = require('lodash');

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
     publishColor: publishColor
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
    loop();
}

function loop() {
    var numBalls = _.size(balls) || 1;
    var period = 2000 / numBalls;

    var iterator = foo();
    iterator.next();
    // console.log('yield');
    setTimeout(loop, period);
}

function* foo() {
    while (true) {
        if (_.isEmpty(balls))
            yield;
        else {
            for (var id in balls) {
                if (balls.hasOwnProperty(id)) {
                    publishColor(id, balls[id].color);
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
        client.publish(publishToTopic,
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

