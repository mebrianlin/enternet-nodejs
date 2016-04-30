var _ = require('lodash');
var fs = require('fs');
var path = require('path');

var logger = require('./logger');

// var INIT_CLIENT_NAME = 'noColor';
// var INIT_CLIENT_NAME = 'accelerationTest';
// var INIT_CLIENT_NAME = 'bowling';
// var INIT_CLIENT_NAME = 'proximityTest';
var INIT_CLIENT_NAME = 'randomColor';
// var INIT_CLIENT_NAME = 'simon';
// var INIT_CLIENT_NAME = 'virus';

module.exports = {
     init: init,
     update: update,
     getCurrentActivity: getCurrentActivity,
     changeActivity: changeActivity
};

var ballHandlers = {};
var ballHandler;
var normalizedPath = path.join(__dirname, 'activities');

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
    logger.error('No intial activity');
}
else if (ballHandler.init) {
    ballHandler.init();
}

function getCurrentActivity() {
    return ballHandler;
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

function init() {

}

function update(balls) {
    if (ballHandler.update)
        ballHandler.update(balls);
}
