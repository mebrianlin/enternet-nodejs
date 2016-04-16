var _ = require('lodash');

var ballManager = require('../ballManagerClient');
var color = require('../../color');

module.exports = {
    // enabled: true
};

var virus = {};
var affecting = {};
var normalBalls = {};
// detectVirusFunction id
var detectVirusFunctionId;

if (module.exports.enabled) {
    setTimeout(startGame, 1000);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startGame(){
    clearInterval(detectVirusFunctionId);
    // var virusId = Object.keys(balls)[getRandomInt(0, _.size(balls))];
    var balls = ballManager.getBalls();
    var virusId = _.chain(balls).keys().sample().value();
    if (!virusId) {
        setTimeout(startGame, 1000);
        return;
    }
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
    setTimeout(function() {
        detectVirusFunctionId = setInterval(detectVirus, 100);
    }, 2000);
}
var timeThreshold = 3000;

function detectVirus(){
    var balls = ballManager.getBalls();
    var newBalls = {};
    _.forOwn(balls, function(ball, id) {
        newBalls[id] = true;
    });

    //affecting to virus
    for(var abId in affecting) {
        if (!balls[abId]) {
            continue;
        }
        delete newBalls[abId];

        var isWithDistance = false;
        for(var vid in virus) {
            if (!balls[vid]) {
                continue;
            }

            if (balls[vid].isNeighbor(abId) ||
                balls[abId].isNeighbor(vid)) {
                isWithDistance = true;
                if(Date.now() - balls[abId].affectingTimestamp >= timeThreshold){
                    virus[abId] = true;
                    changeColor(abId, color.Red);
                    // console.log('\u0007');
                    delete affecting[abId];
                }
                // do not use gradient effect, as it is sending
                // too many messages and the balls will crash
                break;
            }
        }
        if(!isWithDistance){
            //put back to normal
            balls[abId].affectingTimestamp = 0;
            normalBalls[abId] = true;
            changeColor(abId, color.Green);
            delete affecting[abId];
        }
    }
    //normal to affecting
    for(var nbId in normalBalls){
        if (!balls[nbId]) {
            continue;
        }
        delete newBalls[nbId];

        for(var vid1 in virus) {
            if (!balls[vid1]) {
                continue;
            }

            if (balls[vid1].isNeighbor(nbId) ||
                balls[nbId].isNeighbor(vid1)) {
                //affected
                balls[nbId].affectingTimestamp = Date.now();
                affecting[nbId] = true;
                changeColor(nbId, color.Purple);
                delete normalBalls[nbId];
                break;
            }
        }
    }

    _.forOwn(virus, function(ball, id) {
        delete newBalls[id];
    });

    // add the new balls to normal balls
    _.forOwn(newBalls, function(ball, id) {
        normalBalls[id] = true;
    });

    console.log("virus ", Object.keys(virus));
    console.log("affecting ", Object.keys(affecting));
    console.log("normalBalls ", Object.keys(normalBalls));
}

function changeColor(ballId, ballColor) {
    ballManager.changeColor(ballId, ballColor);
}
