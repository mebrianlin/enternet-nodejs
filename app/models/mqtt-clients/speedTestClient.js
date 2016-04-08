var async = require('async');
var mqtt = require('mqtt');
var NanoTimer = require('nanotimer');

var timerObject = new NanoTimer();

var randomTest = Math.random().toString().slice(-5);

var subscribeToTopic = 'ball/test' + randomTest;
var publishToTopic = 'ball/test' + randomTest;

module.exports = {
     // enabled: true,
     connect: connect,
     end: end
};

var client;
var messageCount = 0;
var sending = true;
var interval = '1m';
var testMessage = '1:100,000,000';
var lastMessageTime = Date.now();

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
    // this is too fast
    // async.forever(
    //     function(next) {
    //         sendMessage();
    //         next();
    //     }
    // );
    timerObject.setInterval(sendMessage, '', interval);
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
