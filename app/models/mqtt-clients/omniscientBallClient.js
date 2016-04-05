var mqtt = require('mqtt');
var _ = require('lodash');

var Ball = require('../ball');
var color = require('../color');

var subscribeToTopic = 'ball/put/#';
var publishToTopic = 'ball/get';

module.exports = {
     // enabled: true,
     connect: connect,
     end: end,
     getBalls: getBalls
};

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

    // TODO: forcefully fix malformed JSON, should fix it from the device side
    str = str.replace(' }}', '\"}}');
    var ballData = JSON.parse(str);

    var ballId = ballData.id;
    if (!balls[ballId]) {
        balls[ballId] = new Ball(color.Black);
    }

    balls[ballId].updateMeasurement(ballData);

    // var ACCELERATION_THRESHOLD = 12;
    // if (balls[ballId].acceleration > ACCELERATION_THRESHOLD) {
    //     changeColor(ballId, color.Red);
    // }
    // else {
    //     changeColor(ballId, color.Green);
    // }

    var THRESHOLD = -30;
    // var maxRssi = _.maxBy(_.values(ballData.rssi));
    var maxRssi = -100;

    var values = _.values(ballData.rssi);

    for (var i = 0; i < values.length; ++i) {
        if (maxRssi < values[i] && values[i] < 0) {
            maxRssi = values[i];
        }
        if (THRESHOLD < maxRssi) {
            changeColor(ballId, color.Green);
            return;
        }
    }
    if (maxRssi < -40)
        changeColor(ballId, color.Red);
    else
        changeColor(ballId, color.Blue);
}

function changeColor(ballId, ballColor) {
    balls[ballId].updateColor(ballColor);

    client.publish(publishToTopic,
        color.getPublishableColor(ballId, ballColor));
}
