var mqtt = require('mqtt');
var _ = require('lodash');

var Ball = require('../ball');
var color = require('../color');

// this is where the balls will push their data
var subscribeToTopic = 'ball/put/#';
var publishToTopic = 'ball/get';

// this is what the external modules see
module.exports = {
     // enabled: true, // this is to enable this virus client
     connect: connect,
     end: end
};

// the mqtt client
var client;
// these are the balls
var balls = {};

// connect to the mqtt broker
function connect(url, options) {
    client = mqtt.connect(url, options);

    client.on('connect', onConnect);
    client.on('message', virusHandler);
}

// end the mqtt connection
function end() {
    if (client) {
        client.end();
    }
}

// when connected, subscribe to a topic
function onConnect() {
    client.subscribe(subscribeToTopic);
}

function virusHandler(topic, message) {
    var str = message.toString();

    // TODO: forcefully fix malformed JSON, should fix it from the device side
    str = str.replace(' }}', '\"}}');
    var ballData = JSON.parse(str);

    var ballId = ballData.id;
    if (!balls[ballId]) {
        balls[ballId] = new Ball(color.Black);
    }

    balls[ballId].updateMeasurement(ballData);

    var THRESHOLD = -30;
    var values = _.values(ballData.rssi);

    // if the max value is above the threshold, let the ball be green
    for (var i = 0; i < values.length; ++i) {
        if (THRESHOLD < values[i] && values[i] < -1) {
            changeColor(ballId, color.Green);
            return;
        }
    }

    changeColor(ballId, color.Red);
}

function changeColor(ballId, ballColor) {
    client.publish(publishToTopic,
        color.getPublishableColor(ballId, ballColor));
}
