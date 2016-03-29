var mqtt = require('mqtt');
var path = require('path');
var fs = require('fs');

var titles = {
    get: 'ball/get', // the title where the balls get the data
    put: 'ball/put' // the title where the balls push the data
};

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

var helpers = [];
normalizedPath = path.join(__dirname, 'helpers');
fs.readdirSync(normalizedPath).forEach(function(file) {
    var helper = require('./helpers/' + file);
    if (helper.enabled) {
        helpers.push(helper);
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
        for (var i = 0; i < helpers.length; ++i)
            helpers[i].start(client, titles);

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
        for (var i = 0; i < helpers.length; ++i)
            helpers[i].stop();
        client = null;
    }
};
