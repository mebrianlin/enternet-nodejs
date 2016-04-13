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

        var newColor = [0,0,0];

        if (balls['1'].isNeighbor('5')) {
            newColor[0] += 100;
            // ballManager.changeColor(ballId, color.Red);
        }
        else if (balls['2'].isNeighbor('5')) {
            newColor[1] += 100;
            // ballManager.changeColor(ballId, color.Green);
        }
        else if (balls['3'].isNeighbor('5')) {
            newColor[2] += 100;
            // ballManager.changeColor(ballId, color.Blue);
        }
        else {
            ballManager.changeColor(ballId, color.White);
            return;
        }
        ballManager.changeColor(ballId, newColor);
    }
    catch (ex) {

    }
    // }
}
