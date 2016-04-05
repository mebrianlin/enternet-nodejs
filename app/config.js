
module.exports = {};

var ports = {
   httpPort: 8080, // express port
   mqttPort: 1883, // normal mqtt port
   mqttWsPort: 3000 // mqtt over websocket
};

module.exports.ports = ports;

module.exports.mqttBrokers = {
    'localhost': {
        wsUrl: 'ws://54.88.50.245:' + ports.mqttWsPort,
        mqttUrl: 'mqtt://54.88.50.245:' + ports.mqttPort
    },
    'mosquitto': {
        wsUrl: 'ws://test.mosquitto.org:8080/mqtt',
        mqttUrl: 'mqtt://test.mosquitto.org'
    },
    'shiftr': {
        wsUrl: 'ws://try:try@broker.shiftr.io:80',
        mqttUrl: 'mqtt://try:try@broker.shiftr.io'
    }
};