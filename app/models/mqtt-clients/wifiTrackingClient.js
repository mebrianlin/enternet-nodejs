var mqtt = require('mqtt');
var _ = require('lodash');

var triangle = require('../triangle');
var Ball = require('../ball');
var color = require('../color');
var rssi = require('../rssi');
var logger = require('../logger');

var subscribeToTopic = 'ball/put/#';
var publishToTopic = 'ball/pos';

module.exports = {
     enabled: true,
     connect: connect,
     end: end
};

var client;
var balls = {};

function connect(url, options) {
    client = mqtt.connect(url, options);

    client.on('connect', onConnect);
    client.on('message', ballWifiHandler);
}

function end() {
    if (client) {
        client.end();
    }
}

function onConnect() {
    client.subscribe(subscribeToTopic);
}

function ballWifiHandler(topic, message) {
    var str = message.toString();

    // TODO: forcefully fix malformed JSON, should fix it from the device side
    str = str.replace(' }}', '\"}}');
    var ballData = JSON.parse(str);

// console.log('=======' + ballData.id);
    // console.log(ballData.rssi);

    // TODO: forcefully invert the rssi to get an estimate of distance for now
    for (var r in ballData.rssi) {
        if (ballData.rssi.hasOwnProperty(r)) {
            // ballData.rssi[r] *= -1;
            ballData.rssi[r] = rssi.toDistance(ballData.rssi[r]);
        }
    }

    var ballId = ballData.id;
    if (!balls[ballId]) {
        balls[ballId] = new Ball(color.Black);
    }

    balls[ballId].updateMeasurement(ballData);

    // var distances = _.map(balls, distances);
    var distances = _.map(balls, function(b) {
        return _.values(b.distances);
    });

    if (distances.length !== 3)
        return;

    // var printDistance = _.map(distances, function(n) {
    //     return _.map(n, function(m) {
    //         return Math.floor(m * 100) / 100;
    //     });
    // })
    // console.log(printDistance);

    var results = triangle(
        distances[0][0], distances[0][1],
        distances[1][0], distances[1][1],
        distances[2][0], distances[2][1]
    );

    // distances[ballData.id] = ballData.distances;
    // var results = triangle(
    //     distances[1][2], distances[1][3],
    //     distances[2][1], distances[2][3],
    //     distances[3][1], distances[3][2]
    // );
    // corrupted data
    if (!results) {
        logger.warn('Trilateration failed');
        return;
    }
    var positions = {
        1: {
            x: results[0],
            y: results[1]
        },
        2: {
            x: results[2],
            y: results[3]
        },
        3: {
            x: results[4],
            y: results[5]
        }
    };
    client.publish(publishToTopic, JSON.stringify(positions));
}

// the format of the distances to be passed to triangle
// var distances = {
//    1: {
//       2: 0,
//       3: 0
//    },
//    2: {
//       1: 0,
//       3: 0
//    },
//    3: {
//       1: 0,
//       2: 0
//    }
// };
