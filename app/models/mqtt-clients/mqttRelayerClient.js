var mqtt = require('mqtt');
var config = require('../../config');

var subscribeToExternalTopic = 'ball/#';
var subscribeToLocalTopic = '#'; // subscribe to all topics for the local broker

module.exports = {
     // enabled: true,
     connect: connect,
     end: end
};

var localClient;
var externalClient;

function connect(url, options) {
    // if we are already using a local mqtt broker, do nothing
    if (url.indexOf('localhost') !== -1) {
        return;
    }

    externalClient = mqtt.connect(url, options);

    externalClient.on('connect', onExternalConnect);
    externalClient.on('message', onExternalMessage);

    localClient = mqtt.connect(config.mqttBrokers.localhost.mqttUrl, options);

    externalClient.on('connect', onLocalConnect);
    externalClient.on('message', onLocalMessage);
}

function end() {
    if (externalClient) {
        externalClient.end();
    }
    if (localClient) {
        localClient.end();
    }
}

function onExternalConnect() {
    externalClient.subscribe(subscribeToExternalTopic);
}

function onLocalConnect() {
    localClient.subscribe(subscribeToLocalTopic);
}

function onExternalMessage(topic, message) {
    // relay the message to the local broker
    localClient.publish(topic, message);
}

function onLocalMessage(topic, message) {
    // relay the message to the external broker
    externalClient.publish(topic, message);
}
