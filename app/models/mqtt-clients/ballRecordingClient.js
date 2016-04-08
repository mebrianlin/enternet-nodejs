var _ = require('lodash');
var mqtt = require('mqtt');
var fs = require('fs');
var os = require('os');

module.exports = {
    // enabled: true,
    connect: connect,
    end: end
};

// var subscribeToTopic = 'ball/put/#';
var subscribeToTopic = '#';

var client;

function connect(url, options) {
    client = mqtt.connect(url, options);

    client.on('connect', onConnect);
    client.on('message', ballRecordhandler);
}

function end() {
    if (client) {
        client.end();
    }
}

function onConnect() {
    client.subscribe(subscribeToTopic);
}

function ballRecordhandler(topic, message) {
    var str = message.toString();

    // var ballData;
    // try {
    //     ballData = JSON.parse(str);
    // }
    // catch (ex) {
    //     return;
    // }

    // var text = JSON.stringify({
    //     data: ballData,
    //     time: Date.now()
    // });

    var text = str;

    fs.appendFile('balls-4.dump', text + os.EOL, function(err) {
        if (err) {
            console.log(err);
            return;
        }

        console.log('Recording ball data.');
    });
}

