var mqtt = require('mqtt');
var _ = require('lodash');

var activityManager = require('../activityManager');

var Ball = require('../ball');
var color = require('../color');
var logger = require('../logger');

var subscribeToTopic = 'ball/put/#';
var publishToTopic = 'ball/get';

var BALL_UPDATE_INTERVAL = 200; // default to 200

module.exports = {
     enabled: true,
     connect: connect,
     end: end,
     getBalls: getBalls,
     changeColor: changeColor
};

var client;
var balls = {};

function getBalls() {
    return balls;
}

function connect(url, options) {
    client = mqtt.connect(url, options);

    client.on('connect', onConnect);
    client.on('message', ballHandler);
}

function end() {
    if (client) {
        client.end();
    }
}

function onConnect() {
    client.subscribe(subscribeToTopic);
    activityManager.init();
    setInterval(loop, BALL_UPDATE_INTERVAL);
}

var ballColorUpdater = updateBallColor();

function loop() {
    // update activity
    activityManager.update(balls);

    // publishAllColor();
    ballColorUpdater.next();
}

function* updateBallColor() {
// var i = 1;
// while (true) { console.log(i++); yield;}
    while (true) {
        if (_.isEmpty(balls))
            yield;
        else {
            for (var id in balls) {
                if (balls.hasOwnProperty(id)) {
                    publishColor(id, balls[id].color);
                    yield;
                }
            }
        }
    }
}

function ballHandler(topic, message) {
    var str = message.toString();
    // console.log(str);

    // TODO: forcefully fix malformed JSON, should fix it from the device side
    // str = str.replace(' }}', '\"}}');
    var ballData = JSON.parse(str);

    var ballId = ballData.id;
    updateBall(ballId, ballData);
}

function updateBall(ballId, ballData) {
    if (!balls[ballId]) {
        balls[ballId] = new Ball(color.Red, ballId,
            activityManager.getCurrentActivity().getFilters);
        // synchronoize the color on initializatoin
        changeColor(ballId, color.Red);
    }

    balls[ballId].updateMeasurement(ballData);
}

function changeColor(ballId, ballColor) {
    for (var i = 0; i < ballColor.length; ++i) {
        ballColor[i] = Math.max(Math.min(ballColor[i], 255), 0);
    }
    if (!balls[ballId]) {
        balls[ballId] = new Ball(ballColor, ballId,
            activityManager.getCurrentActivity().getFilters);
    }
    balls[ballId].updateColor(ballColor);
}

// forcefully publish the color without updating the ball
function publishColor(ballId, ballColor) {
    if (client) {
        client.publish(publishToTopic + ballId,
            color.getPublishableColor(ballId, ballColor),
            { qos: 1 });
    }
    else {
        logger.error('MQTT client not connected');
    }
}

function publishAllColor() {
    _.forOwn(balls, function(ball, id) {
        publishColor(id, ball.color);
    });
}
