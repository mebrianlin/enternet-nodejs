var mqtt = require('mqtt');

module.exports = function() {
    var client;
    return {
        connect: connect,
        end: end
    };

    function connect(url) {
        client = mqtt.connect(url);
        client.on('connect', onConnect);
        client.on('message', onMessage);
    }

    function end() {
        if (client) {
            client.end();
            client = null;
        }
    }

    function onConnect() {
        // client.subscribe('ball/#');
        client.subscribe('mqtt/demo');
        setTimeout(function() {
            client.publish('mqtt/demo', 'This is not a song');
        }, 3000);
        client.publish('mqtt/demo', 'This is s song');
    }

    function onMessage(topic, message) {
        // message is Buffer
        console.log("topic: " + topic.toString());
        console.log("message: " + message.toString());
        // client.end();
    }
}



