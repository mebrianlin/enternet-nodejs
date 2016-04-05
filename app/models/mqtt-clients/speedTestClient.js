var mqtt = require('mqtt');

var subscribeToTopic = 'ball/test/#';
var publishToTopic = 'ball/test';

module.exports = {
     enabled: true,
     connect: connect,
     end: end
};

var client;
var messageCount = 0;
var interval = 0.1;
var testMessage = '1:100,000,000';

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
    setInterval(sendMessage, interval);
}

function onMessage(topic, message) {
    ++messageCount;
}

function sendMessage() {
    client.publish(publishToTopic, testMessage);
}

function reportSpeed() {
    console.log('Message per second: ' + messageCount);
    messageCount = 0;
}
