var _ = require('lodash');
var sylvester = require('sylvester');
var mqtt = require('mqtt');

var Ball = require('../ball');
var color = require('../color');
var logger = require('../logger');

var kalman2d = require('../kalman').kalman2d();

var subscribeToTopic = 'ball/put/#';
var publishToTopic = 'ball/pos';

module.exports = {
    // enabled: true,
    connect: connect,
    end: end
};

var client;
var balls = {};

var beacons = [
    $V([ 0, 1 ]),
    $V([ 0, 0 ]),
    $V([ 1, 0 ])
];

var beacon1 = beacons[0];

var A = [];
for (var i = 1; i < beacons.length; ++i) {
    A.push(beacons[i].subtract(beacon1).elements);
}
A = $M(A);

var d = [];
for (var i = 1; i < beacons.length; ++i) {
    var distance = beacons[i].distanceFrom(beacon1);
    d.push(distance * distance);
}
d = $V(d);

var A_trans = A.transpose();
var C = A_trans.x(A);

// var svd = A.svd();
if (C.isSingular()) {
    logger.warn('Warning: beacons: matrix is singular');
}

// distances should be an array of length N
function getPos(distances) {
    var N = beacons.length;

    if (distances.length !== N) {
        logger.error('Length of distances (' + distances.length +
            ') is incorrect');
        return;
    }

    var r1 = $V(_.fill(Array(N - 1), distances[0] * distances[0]));
    var dd = _.clone(distances);
    dd.shift();
    var r = $V(_.map(dd, function(n) {
        return n * n;
    }));

    var b = r1.subtract(r).add(d).x(0.5);

    var x = C.inverse().x(A_trans).x(b).add(beacon1);
    return {
        x: x.e(1),
        y: x.e(2)
    };
}

function iterate(distances, initialPos) {
    if (!initialPos) {
        logger.error('Error: initialPos null');
        return;
    }
    var x = initialPos.x;
    var y = initialPos.y;

    var pos = $V([x, y]);
    // we are only getting x and y
    var JtJ = $M([
        [0, 0],
        [0, 0]
    ]);
    var Jtf = $V([0, 0]);


    // minimize (dr)^2
    for (var i = 0; i < beacons.length; ++i) {

        var beaconi = beacons[i].elements;
        var x_xi = x - beaconi[0];
        var y_yi = y - beaconi[1];
        var x_xi_2 = x_xi * x_xi;
        var y_yi_2 = y_yi * y_yi;
        var x_xi_y_yi = x_xi * y_yi;

        var x_xi2_y_yi2 = x_xi * x_xi + y_yi * y_yi;
        var f_r = Math.sqrt(x_xi2_y_yi2);
        var f = f_r - distances[i];

        JtJ = JtJ.add($M([
            [x_xi_2 / x_xi2_y_yi2, x_xi_y_yi / x_xi2_y_yi2],
            [x_xi_y_yi / x_xi2_y_yi2, y_yi_2 / x_xi2_y_yi2]
        ]));
        Jtf = Jtf.add($V([
            x_xi * f / f_r, y_yi * f / f_r
        ]));
    }

    // minimize (dr/r)^2
    // for (var i = 0; i < beacons.length; ++i) {

    //     var ri = distances[i];
    //     var ri_2 = ri * ri;

    //     var beaconi = beacons[i].elements;
    //     var x_xi = x - beaconi[0];
    //     var y_yi = y - beaconi[1];
    //     var x_xi_2 = x_xi * x_xi;
    //     var y_yi_2 = y_yi * y_yi;
    //     var x_xi_y_yi = x_xi * y_yi;

    //     var x_xi2_y_yi2 = x_xi * x_xi + y_yi * y_yi;
    //     var f_1 = Math.sqrt(x_xi2_y_yi2) / ri;
    //     var f = f_1 - 1;

    //     JtJ = JtJ.add($M([
    //         [x_xi_2 / x_xi2_y_yi2 / ri_2, x_xi_y_yi / x_xi2_y_yi2 / ri_2],
    //         [x_xi_y_yi / x_xi2_y_yi2 / ri_2, y_yi_2 / x_xi2_y_yi2 / ri_2]
    //     ]));
    //     Jtf = Jtf.add($V([
    //         x_xi * f / f_1 / ri_2, y_yi * f / f_1 / ri_2
    //     ]));
    // }


    // console.log('JtJ');
    // console.log(JtJ.inverse().x(Jtf.transpose()));
    var nextPos = pos.subtract(JtJ.inverse().x(Jtf.transpose()));
// console.log(nextPos);
    return {
        x: nextPos.e(1),
        y: nextPos.e(2)
    };
}
// var init = {x:-0.5, y:0.5};
// for (var i = 0; i < 10; ++i) {
//     init = iterate([0.5, 0.5, 1.5], init);
// }

// console.log(getPos([1,1,1]));

function connect(url, options) {
    client = mqtt.connect(url, options);

    client.on('connect', onConnect);
    client.on('message', beaconPositioningHandler);
}

function end() {
    if (client) {
        client.end();
    }
}


function onConnect() {
    client.subscribe(subscribeToTopic);
}

function beaconPositioningHandler(topic, message) {
    var str = message.toString();
// console.log(message.toString());
    // TODO: forcefully fix malformed JSON, should fix it from the device side
    str = str.replace(' }}', '\"}}');
    var ballData = JSON.parse(str);

    // if (ballData.id !== '5') {
    //     return;
    // }

    var ballId = ballData.id;
    if (!balls[ballId]) {
        balls[ballId] = new Ball(color.Black);
    }

    balls[ballId].updateMeasurement(ballData);

    if (!balls[5]) {
        logger.warn('Ball 5 is missing');
        return;
    }

    var distances = [];
    _.forOwn(balls, function(value, id) {
        if (parseInt(id) <= 3) {
            if (value.distances[5])
                distances.push(
                    (value.distances[5] + balls[5].distances[id]) / 2);
            else
                distances.push(balls[5].distances[id]);
        }
    });

    var pos;
    try {
        // pos = getPos(_.values(balls[5].distances));
        pos = getPos(distances);
        // for (var i = 0; i < 10; ++i) {
        //     pos = iterate(distances, pos);
        // }
    }
    catch (ex) {
        logger.error(ex);
    }

    if (!pos) {
        return;
    }
    if (!isFinite(pos.x) || !isFinite(pos.y)) {
        logger.warn('Warning: Invalid position: ');
        logger.warn(pos);
        return;
    }
    var results = kalman2d.filter(pos.x, pos.y);
    // var results = pos;

// console.log(results);
    var positions = {
        1: {
            x: beacons[0].e(1),
            y: beacons[0].e(2)
        },
        2: {
            x: beacons[1].e(1),
            y: beacons[1].e(2)
        },
        3: {
            x: beacons[2].e(1),
            y: beacons[2].e(2)
        },
        5: {
            x: results.x,
            y: results.y
        }
    };
    client.publish(publishToTopic, JSON.stringify(positions));
}

function changeColor(ballId, ballColor) {
    balls[ballId].updateColor(ballColor);

    client.publish(publishToTopic,
        color.getPublishableColor(ballId, ballColor));
}
