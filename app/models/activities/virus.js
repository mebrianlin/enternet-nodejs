var _ = require('lodash');

var color = require('../color');
var noFilter = require('../filters/noFilter');
var kalman1d = require('../kalman').kalman1d;

module.exports = {
    init: init,
    update: update,
    deinit: deinit,
    getFilters: getFilters
};

var virusId;
var virus = {};
var affecting = {};
var normalBalls = {};

var timeThreshold = 1500;

function init() {
    virus = {};
    affecting = {};
    normalBalls = {};
}

function chooseVirus(balls) {
    virusId = _.chain(balls).keys().sample().value();
    if (!virusId) {
        return;
    }
    console.log('vid ', virusId);
    //update virus
    virus[virusId] = balls[virusId];
    balls[virusId].updateColor(color.Red);
    //reset others to green
    for (var bId in balls) {
        if(bId != virusId){
            normalBalls[bId] = balls[bId];
            balls[bId].updateColor(color.Green);
        }
    }
}

function update(balls) {
    if (!virusId)
        chooseVirus(balls);
    detectVirus(balls);
}

function deinit() {
    virusId = null;
}

function detectVirus(balls){
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
                    balls[abId].updateColor(color.Red);
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
            balls[abId].updateColor(color.Green);
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
                balls[nbId].updateColor(color.Purple);
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

function getFilters() {
    return {
        acceleration: kalman1d({R: 0.01, Q: 0.01}),
        distance: noFilter() // kalman1d({R: 0.01, Q: 0.01})
    };
}
