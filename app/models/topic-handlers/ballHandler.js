var _ = require('lodash');

var triangle = require('../triangle');
var Ball = require('../ball');

module.exports = {
   topic: 'ball/put',
   handler: ballHandler
};

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

var balls = {};
var RED   = { r: 100, g:   0, b:   0 };
var GREEN = { r:   0, g: 100, b:   0 };

function ballHandler(client, message) {
    var str = message.toString();

    // forcefully fix malformed json
    str = str.replace(', }', '}}');
    var ballData = JSON.parse(str);

    var ballId = ballData.id;
    if (!balls[ballId]) {
        balls[ballId] = new Ball();
    }

    balls[ballId].update(ballData);

    var THRESHOLD = -30;
    var maxRssi = _.maxBy(_.values(ballData.rssi));
    /* 0 indicates no signal, so we are counting from 1 here */
    if (THRESHOLD < maxRssi && maxRssi < -1) {
        client.publish('ball/get', getPublishableColor(ballId, GREEN));
    }
    else {
        client.publish('ball/get', getPublishableColor(ballId, RED));
    }

//     client.publish('ball/pos', JSON.stringify(positions));
}

function getRandomInt(min, max) {
    return 10 * Math.floor((
        Math.floor(Math.random() * (max - min + 1)) + min) / 10);
}

function getPublishableColor(ballId, color) {
    return ballId + ':' + zeroFill(color.r, 3) + ',' +
        zeroFill(color.g, 3) + ',' + zeroFill(color.b, 3);
}

function zeroFill(number, size) {
    number = number.toString();
    while (number.length < size)
        number = '0' + number;
    return number;
}
