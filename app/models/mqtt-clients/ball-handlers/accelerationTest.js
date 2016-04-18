var ballManager = require('../ballManagerClient');
var color = require('../../color');

module.exports = {
    // enabled: true,
    update: update
};

function update(ballId) {
    // if (ballId == 5) {
    try {
        var balls = ballManager.getBalls();

        var newColor = balls[ballId].getColor();
        var a = balls[ballId].acceleration;
        if (a > 10) {
            newColor[0] += 30;
        }
        else {
            newColor[0] -= 30;
        }
        newColor[2] = 50;
        newColor[3] = 50;
        ballManager.changeColor(ballId, newColor);
        if (ballId === '2')
            console.log(newColor);
        // var a = (balls[ballId].acceleration - 9) * 10;
        // var newColor = [a,10,10];
        // ballManager.changeColor(ballId, newColor);

    }
    catch (ex) {

    }
    // }
}
