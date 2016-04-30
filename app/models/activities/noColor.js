var _ = require('lodash');
var color = require('../color');

module.exports = {
    update: update
};

function update(balls) {
    _.forOwn(balls, function(ball, id) {
        ball.updateColor(color.Black);
    });
}
