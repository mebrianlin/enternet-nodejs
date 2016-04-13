var mqtt = require('mqtt');
var _ = require('lodash');

var Ball = require('../ball');
var color = require('../color');

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

fs.readdirSync(normalizedPath).forEach(function(file) {
    if (!fs.statSync(path.join(normalizedPath, file)).isFile()) {
        return;
    }
    var handler = require(path.join(normalizedPath, file));
    if (handler.enabled) {
        ballHandlers.push(handler);
    }
});

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
}

function ballHandler(topic, message) {
    var str = message.toString();
console.log(str);
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
            color.getPublishableColor(ballId, ballColor));
    }
}

function changeColor(ballId, ballColor) {
    balls[ballId].updateColor(ballColor);
    publishColor(ballId, ballColor);
}

