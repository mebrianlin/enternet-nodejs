var mqtt    = require('mqtt');

module.exports = function() {
    var client;
    return {
        connect: connect,
        end: end
    };

    function connect(url) {
        client = mqtt.connect(url);
        client.on('connect', function () {
            client.subscribe('enternet/mqtt');
            setTimeout(function() {
                client.publish('enternet/mqtt', 'This is not a song');
            }, 3000);
            client.publish('enternet/mqtt', 'This is a song');
        });

        client.on('message', function (topic, message) {
            // message is Buffer
            console.log("topic:" + topic.toString());
            console.log("message:" + message.toString());
            // client.end();
        });
    }

    function end() {
        if (client) {
            client.end();
            client = null;
        }
    }
}



