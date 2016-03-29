var mqtt = require('mqtt');
var path = require('path');
var fs = require('fs');

var mockDataSender = require('./mockDataSender');

var topicHandler = {};
var normalizedPath = path.join(__dirname, 'topic-handlers');
fs.readdirSync(normalizedPath).forEach(function(file) {
    var handler = require('./topic-handlers/' + file);
    if (handler.topic && handler.handler) {
        if (!topicHandler[handler.topic])
            topicHandler[handler.topic] = [];
        topicHandler[handler.topic].push(handler.handler);
    }
});

module.exports = function() {
    var client;

    return {
        connect: connect,
        end: end
    };

    function connect(url, options) {
        client = mqtt.connect(url, options);
        client.on('connect', onConnect);
        client.on('message', onMessage);
        client.on('close', onClose);
    }

    function end() {
        if (client) {
            client.end();
            client = null;
        }
    }

    function onConnect() {
        for (var topic in topicHandler) {
            if (topicHandler.hasOwnProperty(topic))
                client.subscribe(topic);
        }
        mockDataSender.start(client);
        // client.subscribe(subscribeToTopic);
    }

    function onMessage(topic, message) {
        if (topicHandler[topic]) {
            for (var i = 0; i < topicHandler[topic].length; ++i)
                topicHandler[topic][i](client, message);
        }
        // client.end();
    }

    function onClose(topic, message) {
        mockDataSender.stop();
        client = null;
    }
};

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
