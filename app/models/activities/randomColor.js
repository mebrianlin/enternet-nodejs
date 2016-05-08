var _ = require('lodash');

var color = require('../color');

module.exports = {
     init: init,
     update: update
};

var last;
var UPDATE_INTERVAL = 1000;

function init() {
    last = Date.now();
}

function update(balls) {
    var now = Date.now();
    if (now - last >= UPDATE_INTERVAL) {
        var c = color.getRandomColor();
        _.forOwn(balls, function(ball, id) {
            ball.updateColor(c);
        });
        while (now - last >= UPDATE_INTERVAL)
            last += UPDATE_INTERVAL;
    }
}
