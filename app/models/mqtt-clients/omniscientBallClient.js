var mqtt = require('mqtt');
var _ = require('lodash');

var Ball = require('../ball');
var color = require('../color');
var rssi = require('../rssi');

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
    console.log(str);

    // TODO: forcefully fix malformed JSON, should fix it from the device side
    str = str.replace(' }}', '\"}}');
    var ballData = JSON.parse(str);



    for (var r in ballData.rssi) {
        if (ballData.rssi.hasOwnProperty(r)) {
            ballData.rssi[r] = rssi.toDistance(ballData.rssi[r]);
        }
    }



    var ballId = ballData.id;
    if (!balls[ballId]) {
        balls[ballId] = new Ball(color.Black);
    }

    balls[ballId].updateMeasurement(ballData);




    var values = _.values(balls[ballId].distances);
    var maxDistance = 0;
    for (var i = 0; i < values.length; ++i) {
        if (maxDistance < values[i]) {
            maxDistance = values[i];
        }
    }
    // console.log(maxDistance);
    if (maxDistance < 0.5)
        changeColor(ballId, color.Green);
    else if (maxDistance < 1.7)
        changeColor(ballId, color.Blue);
    else
        changeColor(ballId, color.Red);



    // var THRESHOLD = -35;
    // // var maxRssi = _.maxBy(_.values(ballData.rssi));
    // var maxRssi = -100;

    // var values = _.values(ballData.rssi);

    // for (var i = 0; i < values.length; ++i) {
    //     if (maxRssi < values[i] && values[i] < 0) {
    //         maxRssi = values[i];
    //     }
    //     if (THRESHOLD < maxRssi) {
    //         changeColor(ballId, color.Green);
    //         return;
    //     }
    // }
    // if (maxRssi < -45)
    //     changeColor(ballId, color.Red);
    // else
    //     changeColor(ballId, color.Blue);
}

function changeColor(ballId, ballColor) {
    balls[ballId].updateColor(ballColor);

    client.publish(publishToTopic,
        color.getPublishableColor(ballId, ballColor));
}
