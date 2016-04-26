var mqtt = require('mqtt');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');

var logger = require('../logger');

var subscribeToTopic = 'ball/put/#';

var INIT_CLIENT_NAME = 'noColor';
// var INIT_CLIENT_NAME = 'accelerationTest';
// var INIT_CLIENT_NAME = 'bowling';
// var INIT_CLIENT_NAME = 'proximityTest';
// var INIT_CLIENT_NAME = 'randomColor';
// var INIT_CLIENT_NAME = 'simon';
// var INIT_CLIENT_NAME = 'virus';

module.exports = {
     enabled: true,
     connect: connect,
     end: end,
     getCurrentActivity: getCurrentActivity,
     getActivityNames: getActivityNames,
     restartActivity: restartActivity,
     changeActivity: changeActivity
};

var ballHandlers = {};
var ballHandler;
var normalizedPath = path.join(__dirname, 'ball-handlers');

fs.readdirSync(normalizedPath).forEach(function(file) {
    if (!fs.statSync(path.join(normalizedPath, file)).isFile()) {
        return;
    }
    var name = path.basename(file, '.js');
    ballHandlers[name] = require(path.join(normalizedPath, name));

    if (name === INIT_CLIENT_NAME)
        ballHandler = ballHandlers[name];
});

if (!ballHandler) {
    logger.error('No intial ball handler');
}

function connect(url, options) {
    client = mqtt.connect(url, options);

    client.on('connect', onConnect);
    client.on('message', activityManager);
}

function end() {
    if (client) {
        client.end();
    }
}

function onConnect() {
    client.subscribe(subscribeToTopic);

    if (ballHandler.init)
        ballHandler.init();
}

function getCurrentActivity() {
    return ballHandler;
}

function getActivityNames() {
    return _.keys(ballHandlers);
}

function changeActivity(activityName) {
    if (!ballHandlers[activityName]) {
        return 'The activity does not exist.';
    }
    logger.info('Changing activity to "' + activityName + '"');

    if (ballHandler.deinit)
        ballHandler.deinit();

    ballHandler = ballHandlers[activityName];
    if (ballHandler.init)
        ballHandler.init();
    if (!ballHandler.getFilters)
        logger.info('Using default filters for the balls');

    return 'Succeeded';
}

function activityManager(topic, message) {
    var str = message.toString();

    // TODO: forcefully fix malformed JSON, should fix it from the device side
    str = str.replace(' }}', '\"}}');
    var ballData = JSON.parse(str);
    var ballId = ballData.id;

    if (ballHandler.update)
        ballHandler.update(ballId);
}

function restartActivity() {
    if (ballHandler.deinit)
        ballHandler.deinit();
    if (ballHandler.init)
        ballHandler.init();
}
