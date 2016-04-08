var _ = require('lodash');
var mqtt = require('mqtt');

// var subscribeToTopic = 'ball/put/#';
var subscribeToTopic = '#';

module.exports = {
     // enabled: true,
     connect: connect,
     end: end
};

var client;
var messageCount = {};

function connect(url, options) {
    client = mqtt.connect(url, options);

    client.on('connect', onConnect);
    client.on('message', onMessage);
}

function end() {
    if (client) {
        client.end();
    }
}

function onConnect() {
    client.subscribe(subscribeToTopic);
    setInterval(reportSpeed, 1000);
}

function onMessage(topic, message) {
    var str = message.toString();

    console.log(str);

    var ballId = getId(topic, message);

    if (!messageCount[ballId]) {
        messageCount[ballId] = 0;
    }

    ++messageCount[ballId];
}

function getId(topic, message) {
    var str = message.toString();

    // TODO: forcefully fix malformed JSON, should fix it from the device side
    // str = str.replace(' }}', '\"}}');
    // var ballData = JSON.parse(str);

    // return ballData.id;
    return 0;
}

function reportSpeed() {
    console.log('===== Speed =====');
    _.forOwn(messageCount, function(value, key) {
        console.log('\t' + key + '\t' + value + 'mps');
        // delete messageCount[key];
        messageCount[key] = 0;
    });
}
