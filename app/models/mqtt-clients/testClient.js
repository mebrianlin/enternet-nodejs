var mqtt = require('mqtt');
var _ = require('lodash');

var Ball = require('../ball');
var color = require('../color');

var subscribeToTopic = 'ball/put/#';
var publishToTopic = 'ball/get';

module.exports = {
     // enabled: true,
     connect: connect,
     end: end
};

var client;
var balls = {};

function connect(url, options) {
    client = mqtt.connect(url, options);

    client.on('connect', onConnect);
    client.on('message', testHandler);

}

function end() {
    if (client) {
        client.end();
    }
}

function onConnect() {
    client.subscribe(subscribeToTopic);
}

function testHandler(topic, message) {
    var str = message.toString();

    // TODO: forcefully fix malformed JSON, should fix it from the device side
    str = str.replace(' }}', '\"}}');
    var ballData = JSON.parse(str);

    // TODO: forcefully invert the rssi to get an estimate of distance for now

    var ballId = ballData.id;
    if (!balls[ballId]) {
        balls[ballId] = new Ball(color.Black);
    }

    balls[ballId].updateMeasurement(ballData);

    var ACCELERATION_THRESHOLD = 12;
    if (balls[ballId].acceleration > ACCELERATION_THRESHOLD) {
        changeColor(ballId, color.Red);
    }
    else {
        changeColor(ballId, color.Blue);
    }
}


function changeColor(ballId, ballColor) {
    balls[ballId].updateColor(ballColor);

    client.publish(publishToTopic,
        color.getPublishableColor(ballId, ballColor));
}
