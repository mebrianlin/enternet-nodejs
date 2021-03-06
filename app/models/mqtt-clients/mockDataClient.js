var mqtt = require('mqtt');

module.exports = {
    // enabled: true,
    connect: connect,
    end: end
};

var publishToTitle = 'ball/put/fake';
var intervalId;
var interval = 1000;

var client;

function connect(url, options) {
    client = mqtt.connect(url, options);

    client.on('connect', onConnect);
}

function end() {
    if (client) {
        client.end();
    }
}

function onConnect() {
    start();
}

function start() {
    intervalId = setInterval(function() {
        client.publish(publishToTitle, JSON.stringify({
            fake: true,
            id: 'fake',
            acceleration: Math.random() * 9.8,
            rssi: {
                1: 0,
                2: 0,
                3: 0
            }
        }));
    }, interval);
}

function stop() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}
