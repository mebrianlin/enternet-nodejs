var _ = require('lodash');

var triangle = require('../triangle');
var Ball = require('../ball');
var color = require('../color');

module.exports = {
   topic: 'ball/wifi',
   handler: ballWifiHandler
};

// the format of the distances to be passed to triangle
// var distances = {
//    1: {
//       2: 0,
//       3: 0
//    },
//    2: {
//       1: 0,
//       3: 0
//    },
//    3: {
//       1: 0,
//       2: 0
//    }
// };

var balls = {};
var publishToTopic = 'ball/pos';

function ballWifiHandler(client, message) {
    var str = message.toString();
    var ballData = JSON.parse(str);

    var ballId = ballData.id;
    if (!balls[ballId]) {
        balls[ballId] = new Ball(color.Black);
    }

    balls[ballId].updateMeasurement(ballData);

    // var distances = _.map(balls, distances);
    var distances = _.map(balls, function(b) {
        return _.values(b.distances);
    });

    if (distances.length !== 3)
        return;
    // if (_.size(distances) !== 3)
    //     return;

     var results = triangle(
        distances[0][0], distances[0][1],
        distances[1][0], distances[1][1],
        distances[2][0], distances[2][1]
    );

    // distances[ballData.id] = ballData.distances;
    // var results = triangle(
    //     distances[1][2], distances[1][3],
    //     distances[2][1], distances[2][3],
    //     distances[3][1], distances[3][2]
    // );
    // corrupted data
    if (!results) {
        return;
    }
    var positions = {
        1: {
            x: results[0],
            y: results[1]
        },
        2: {
            x: results[2],
            y: results[3]
        },
        3: {
            x: results[4],
            y: results[5]
        }
    };
    client.publish(publishToTopic, JSON.stringify(positions));
}
