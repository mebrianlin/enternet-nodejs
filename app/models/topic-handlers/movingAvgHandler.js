var util = require('../util');
var movingAverage = util.movingAverage(3);

var publishToTopic = '/etc_get';

module.exports = {
   topic: '/etc_topic_1',
   handler: wifiSignalHangler
};

function wifiSignalHangler(client, message) {
    var signalStrength = parseInt(message);
    var averageSignalStrength = movingAverage(signalStrength);

    if (averageSignalStrength <= -45)
        client.publish(publishToTopic, "Red");
    else
        client.publish(publishToTopic, "Green");
}