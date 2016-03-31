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
            client.publish(publishToTopic,
                color.getPublishableColor(ballId, color.Green));
            return;
        }
    }
    client.publish(publishToTopic, color.getPublishableColor(ballId, color.Red));
}
