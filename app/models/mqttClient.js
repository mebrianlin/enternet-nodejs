var mqtt = require('mqtt');

module.exports = function() {
    var client;
    var subscribeToTopic = '/etc_topic';
    var publishToTopic = '/etc_get';

    return {
        connect: connect,
        end: end
    };

    function connect(url, options) {
        client = mqtt.connect(url, options);
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
        client.subscribe(subscribeToTopic);
    }

    function onMessage(topic, message) {
        // message is Buffer
        // console.log("topic: " + topic);
        // console.log("message: " + message);
        if (parseInt(message) < 50)
            client.publish(publishToTopic, "red");
        else
            client.publish(publishToTopic, "green");
        // client.end();
    }
}

