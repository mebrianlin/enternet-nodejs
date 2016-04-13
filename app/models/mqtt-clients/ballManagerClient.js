var mqtt = require('mqtt');

var Ball = require('../ball');
var color = require('../color');

var subscribeToTopic = 'ball/put/#';
var publishToTopic = 'ball/get';

module.exports = {
     enabled: true,
     connect: connect,
     end: end,
     getBalls: getBalls,
     changeColor: changeColor
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
}

function ballHandler(topic, message) {
    var str = message.toString();
// console.log(str);
    // TODO: forcefully fix malformed JSON, should fix it from the device side
    str = str.replace(' }}', '\"}}');
    var ballData = JSON.parse(str);

    var ballId = ballData.id;
    if (!balls[ballId]) {
        balls[ballId] = new Ball(color.White);
        // synchronoize the color on initializatoin
        changeColor(ballId, color.White);
    }

    balls[ballId].updateMeasurement(ballData);

    for (var i = 0; i < ballHandlers.length; ++i) {
        ballHandlers[i].update(ballId);
    }
}

function changeColor(ballId, ballColor) {
// console.log(ballColor);
    balls[ballId].updateColor(ballColor);

    client.publish(publishToTopic,
        color.getPublishableColor(ballId, ballColor));
}
