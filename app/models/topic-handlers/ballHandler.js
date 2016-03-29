var _ = require('lodash');

var Ball = require('../ball');
var color = require('../color');

module.exports = {
   topic: 'ball/put',
   handler: ballHandler,
   getBalls: getBalls
};

var balls = {};
var publishToTopic = 'ball/get';

function getBalls() {
    return balls;
}

function ballHandler(client, message) {
    var str = message.toString();
    // console.log(str);

    // forcefully fix malformed json
    str = str.replace(', }', '}}');
    var ballData = JSON.parse(str);

    var ballId = ballData.id;
    if (!balls[ballId]) {
        balls[ballId] = new Ball(color.Black);
    }

    balls[ballId].updateMeasurement(ballData);

    var THRESHOLD = -30;
    //var maxRssi = _.maxBy(_.values(ballData.rssi));
    var values = _.values(ballData.rssi);
    for (var i = 0; i < values.length; ++i) {
        if (THRESHOLD < values[i] && values[i] < -1) {
            client.publish(publishToTopic, getPublishableColor(ballId, color.Green));
            return;
        }
    }
    client.publish(publishToTopic, getPublishableColor(ballId, color.Red));
}

function getRandomInt(min, max) {
    return 10 * Math.floor((
        Math.floor(Math.random() * (max - min + 1)) + min) / 10);
}

function getPublishableColor(ballId, color) {
    return ballId + ':' + zeroFill(color[0], 3) + ',' +
        zeroFill(color[1], 3) + ',' + zeroFill(color[2], 3);
}

function zeroFill(number, size) {
    number = number.toString();
    while (number.length < size)
        number = '0' + number;
    return number;
}
