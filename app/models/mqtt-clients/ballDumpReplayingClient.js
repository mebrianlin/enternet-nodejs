var mqtt = require('mqtt');
var readline = require('readline');
var path = require('path');
var fs = require('fs');

module.exports = {
    enabled: true,
    connect: connect,
    end: end
};

var publishToTopic = 'ball/put/';

var client;
var ballsDump = [];
var intervalId;
var interval = 50;
var index = 0;

var rl = readline.createInterface({
    input: fs.createReadStream('balls-4-bidirectional.dump')
});

rl.on('line', function(line) {
    ballsDump.push(line);
});

function connect(url, options) {
    client = mqtt.connect(url, options);

    client.on('connect', startReplay);
}

function end() {
    if (client) {
        client.end();
        stopReplay();
    }
}

function startReplay() {
    intervalId = setInterval(function() {
        client.publish(publishToTopic, ballsDump[index]);
        index = (index + 1) % ballsDump.length;
    }, interval);
}

function stopReplay() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

