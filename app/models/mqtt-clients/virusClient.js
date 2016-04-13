var mqtt = require('mqtt');
var _ = require('lodash');

var Ball = require('../ball');
var color = require('../color');

// this is where the balls will push their data
var subscribeToTopic = 'ball/put/#';
var publishToTopic = 'ball/get';

// this is what the external modules see
module.exports = {
     // enabled: true, // this is to enable this virus client
     connect: connect,
     end: end
};

// the mqtt client
var client;
// these are the balls
var balls = {};
var virus = {};
var affecting = {};
var normalBalls = {};
// detectVirusFunction id
var detectVirusFunctionId;
var THRESHOLD = -35;
// connect to the mqtt broker
function connect(url, options) {
    client = mqtt.connect(url, options);

    client.on('connect', onConnect);
    client.on('message', virusHandler);
}

// end the mqtt connection
function end() {
    if (client) {
        client.end();
    }
}

// when connected, subscribe to a topic
function onConnect() {
    client.subscribe(subscribeToTopic);
    setTimeout(startGame, 5000);
}

function virusHandler(topic, message) {
    var str = message.toString();
// console.log(str);
    // TODO: forcefully fix malformed JSON, should fix it from the device side
    str = str.replace(' }}', '\"}}');
    var ballData = JSON.parse(str);

    var ballId = ballData.id;
    if (!balls[ballId]) {
        balls[ballId] = new Ball(color.Black, ballId);
    }

    balls[ballId].updateMeasurement(ballData);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startGame(){
    clearInterval(detectVirusFunctionId);
    // var virusId = Object.keys(balls)[getRandomInt(0, _.size(balls))];
    var virusId = 2;
    console.log("vid ", virusId);
    virus = {};
    affecting = {};
    normalBalls = {};
    //update virus
    virus[virusId] = balls[virusId];
    changeColor(virusId, color.Red);
    //reset others to green
    for (var bId in balls) {
        if(bId != virusId){
            normalBalls[bId] = balls[bId];
            changeColor(bId, color.Green);
        }
    }
    detectVirusFunctionId = setInterval(detectVirus, 100);
}
var timeThreshold = 3000;

function detectVirus(){
    //affecting to virus
    for(var abId in affecting){
        var isWithDistance = false;
        for(var vid in virus) {
            var avgDistance = affecting[abId].distances[vid];
            if (virus[vid] && virus[vid].distances[abId] < 0) {
                avgDistance = (avgDistance +
                    virus[vid].distances[abId]) / 2;
            }
            if(avgDistance < 0 &&
                avgDistance >= THRESHOLD){
                isWithDistance = true;
                if(Date.now() - affecting[abId].affectingTimestamp >= timeThreshold){
                    virus[abId] = affecting[abId];
                    changeColor(abId, color.Red);
                    delete affecting[abId];
                }
                break;
            }
        }
        if(!isWithDistance){
            //put back to normal
            affecting[abId].affectingTimestamp = 0;
            normalBalls[abId] = affecting[abId];
            changeColor(abId, color.Green);
            delete affecting[abId];
        }
    }
    //normal to affecting
    for(var nbId in normalBalls){
        for(var vid1 in virus) {
            var avgDistance1 = normalBalls[nbId].distances[vid1];
            if (virus[vid1] && virus[vid1].distances[nbId] < 0) {
                avgDistance1 = (avgDistance1 +
                    virus[vid1].distances[nbId]) / 2;
            }
            // if (normalBalls[nbId].distances[vid1] >= THRESHOLD) {
            if(avgDistance1 < 0 &&
                avgDistance1 >= THRESHOLD){
                //affected
                normalBalls[nbId].affectingTimestamp = Date.now();
                affecting[nbId] = normalBalls[nbId];
                changeColor(nbId, color.Purple);
                delete normalBalls[nbId];
                break;
            }
        }
    }
    console.log("virus ", Object.keys(virus));
    console.log("affecting ", Object.keys(affecting));
    console.log("normalBalls ", Object.keys(normalBalls));
}

function changeColor(ballId, ballColor) {
    // console.log("changeColor ");
    // console.log(balls[ballId]);
    // console.log(ballId);
    if (!balls[ballId]) {
        return;
    }

    balls[ballId].color = ballColor;
    // console.log(balls);

    client.publish(publishToTopic,
        color.getPublishableColor(ballId, ballColor));
}
