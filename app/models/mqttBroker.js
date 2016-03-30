var mqtt = require('mqtt');
var mosca = require('mosca');
var logger = require('./logger');
var ports = require('../config.js').ports;

module.exports = function() {
    var settings = {
        http: {
            port: ports.mqttWsPort,
            bundle: true,
            static: './'
        },
        mqtt: {
            port: ports.mqttPort
        }
    };

    //here we start mosca
    var server = new mosca.Server(settings);
    server.on('ready', setup);

    // fired when the mqtt server is ready
    function setup() {
        logger.log('mqtt', 'Mosca server is up and running');
    }

    // fired whena  client is connected
    server.on('clientConnected', function(client) {
        logger.log('mqtt', 'CONNECT: client id:' + client.id);
    });

    // fired when a message is received
    server.on('published', function(packet, client) {
        if (client) {
            logger.log('mqtt', 'PUBLISHED: %s -> %s', client.id, packet.topic);
            logger.log('mqtt', packet.payload.toString());
        }
    });

    // fired when a client subscribes to a topic
    server.on('subscribed', function(topic, client) {
        logger.log('mqtt', 'SUBSCRIBE: %s -> %s', client.id, topic);
    });

    // fired when a client subscribes to a topic
    server.on('unsubscribed', function(topic, client) {
        logger.log('mqtt', 'UNSUBSCRIBE: %s -> %s', client.id, topic);
    });

    // fired when a client is disconnecting
    server.on('clientDisconnecting', function(client) {
        logger.log('mqtt', 'DISCONNECTING: %s', client.id);
    });

    // fired when a client is disconnected
    server.on('clientDisconnected', function(client) {
        logger.log('mqtt', 'DISCONNECTED: %S', client.id);
    });
};

// module.exports = function(port) {
//     return new mqtt.Server(function(client) {
//         var self = this;

//         if (!self.clients)
//             self.clients = {};

//         client.on('connect', function(packet) {
//             self.clients[packet.clientId] = client;
//             client.id = packet.clientId;
//             logger.log('mqtt', 'CONNECT: client id:' + client.id);
//             client.subscriptions = [];
//             client.connack({returnCode: 0});
//         });

//         client.on('subscribe', function(packet) {
//             var granted = [];
//             logger.log('mqtt', 'SUBSCRIBE: %s -> %s', client.id, packet.topic, packet);

//             for (var i = 0; i < packet.subscriptions.length; i++) {
//                 var qos = packet.subscriptions[i].qos
//                     , topic = packet.subscriptions[i].topic
//                     , reg = new RegExp(topic.replace('+', '[^\/]+').replace('#', '.+') + '$');

//                 granted.push(qos);
//                 client.subscriptions.push(reg);
//             }

//             client.suback({messageId: packet.messageId, granted: granted});
//         });

//         client.on('publish', function(packet) {
//             logger.log('mqtt', 'PUBLISH: %s -> %s', client.id, packet.topic, packet);
//             for (var k in self.clients) {
//                 var c = self.clients[k];

//                 for (var i = 0; i < c.subscriptions.length; i++) {
//                     var s = c.subscriptions[i];

//                     if (s.test(packet.topic)) {
//                         c.publish({topic: packet.topic, payload: packet.payload});
//                         break;
//                     }
//                 }
//             }
//         });

//         client.on('pingreq', function(packet) {
//             logger.log('mqtt', 'PINGREQ: %s', client.id);
//             client.pingresp();
//         });

//         client.on('disconnect', function(packet) {
//             client.stream.end();
//         });

//         client.on('close', function(packet) {
//             delete self.clients[client.id];
//         });

//         client.on('error', function(e) {
//             client.stream.end();
//             logger.error(e);
//         });
//     }).listen(port);
// }
