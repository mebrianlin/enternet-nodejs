var mqtt = require('mqtt');
var logger = require('./logger');

module.exports = function() {
    return new mqtt.Server(function(client) {
        var self = this;

        if (!self.clients)
            self.clients = {};

        client.on('connect', function(packet) {
            self.clients[packet.clientId] = client;
            client.id = packet.clientId;
            logger.log('mqtt', 'CONNECT: client id:' + client.id);
            client.subscriptions = [];
            client.connack({returnCode: 0});
        });

        client.on('subscribe', function(packet) {
            var granted = [];
            logger.log('mqtt', 'SUBSCRIBE: %s -> %s', client.id, packet.topic, packet);

            for (var i = 0; i < packet.subscriptions.length; i++) {
                var qos = packet.subscriptions[i].qos
                    , topic = packet.subscriptions[i].topic
                    , reg = new RegExp(topic.replace('+', '[^\/]+').replace('#', '.+') + '$');

                granted.push(qos);
                client.subscriptions.push(reg);
            }

            client.suback({messageId: packet.messageId, granted: granted});
        });

        client.on('publish', function(packet) {
            logger.log('mqtt', 'PUBLISH: %s -> %s', client.id, packet.topic, packet);
            for (var k in self.clients) {
                var c = self.clients[k];

                for (var i = 0; i < c.subscriptions.length; i++) {
                    var s = c.subscriptions[i];

                    if (s.test(packet.topic)) {
                        c.publish({topic: packet.topic, payload: packet.payload});
                        break;
                    }
                }
            }
        });

        client.on('pingreq', function(packet) {
            logger.log('mqtt', 'PINGREQ: %s', client.id);
            client.pingresp();
        });

        client.on('disconnect', function(packet) {
            client.stream.end();
        });

        client.on('close', function(packet) {
            delete self.clients[client.id];
        });

        client.on('error', function(e) {
            client.stream.end();
            logger.error(e);
        });
    });
}

// module.exports = {
//     start: start,
//     url: 'mqtt://localhost' + (port ? (':' + port) : '')
// };

function start(port) {
    new mqtt.Server(function(client) {
        var self = this;

        if (!self.clients)
            self.clients = {};

        client.on('connect', function(packet) {
            self.clients[packet.clientId] = client;
            client.id = packet.clientId;
            console.log("CONNECT: client id: " + client.id);
            client.subscriptions = [];
            client.connack({returnCode: 0});
        });

        client.on('subscribe', function(packet) {
            var granted = [];

            console.log("SUBSCRIBE(%s): %j", client.id, packet);

            for (var i = 0; i < packet.subscriptions.length; i++) {
                var qos = packet.subscriptions[i].qos
                    , topic = packet.subscriptions[i].topic
                    , reg = new RegExp(topic.replace('+', '[^\/]+').replace('#', '.+') + '$');

                granted.push(qos);
                client.subscriptions.push(reg);
            }

            client.suback({messageId: packet.messageId, granted: granted});
        });

        client.on('publish', function(packet) {
            console.log("PUBLISH(%s): %j", client.id, packet);
            for (var k in self.clients) {
                var c = self.clients[k];

                for (var i = 0; i < c.subscriptions.length; i++) {
                    var s = c.subscriptions[i];

                    if (s.test(packet.topic)) {
                        c.publish({topic: packet.topic, payload: packet.payload});
                        break;
                    }
                }
            }
        });

        client.on('pingreq', function(packet) {
            console.log('PINGREQ(%s)', client.id);
            client.pingresp();
        });

        client.on('disconnect', function(packet) {
            client.stream.end();
        });

        client.on('close', function(packet) {
            delete self.clients[client.id];
        });

        client.on('error', function(e) {
            client.stream.end();
            console.log(e);
        });
    }).listen(port);
}