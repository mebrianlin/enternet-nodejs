var ballManager = require('../ballManagerClient');
var color = require('../../color');

module.exports = {
    enabled: true,
    update: update
};

var moving = {

};

function update(ballId) {
    try {
        var balls = ballManager.getBalls();

        var a = balls[ballId].acceleration;
        if (a > 12) {
            if (!moving[ballId]) {
                // ballManager.changeColor(ballId, color.getRandomColor());
                ballManager.changeColor(ballId, color.Blue);
                moving[ballId] = true;
            }
        }
        else {
            ballManager.changeColor(ballId, color.Black);
            moving[ballId] = false;
        }
        // var a = (balls[ballId].acceleration - 9) * 10;
        // var newColor = [a,10,10];
        // ballManager.changeColor(ballId, newColor);

    }
    catch (ex) {

    }
}
