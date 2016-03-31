module.exports = {
    Black: [  0,   0,   0],
    Red  : [100,   0,   0],
    Green: [  0, 100,   0],
    Blue : [  0,   0, 100],

    getRandomColor: getRandomColor,
    getPublishableColor: getPublishableColor
};

var COLOR_MAX = 100;
var COLOR_MIN = 0;

function getRandomColor() {
    return [
        getRandomInt(COLOR_MIN, COLOR_MAX),
        getRandomInt(COLOR_MIN, COLOR_MAX),
        getRandomInt(COLOR_MIN, COLOR_MAX)
    ];
}

function getRandomInt(min, max) {
    return 10 * Math.floor((
        Math.floor(Math.random() * (max - min + 1)) + min) / 10);
}

// given a color, return a formatted string that is used for mqtt publishing
// format: '<ballId>:<red>,<green>,<blue>', the colors are 3-digit numbers
function getPublishableColor(ballId, color) {
    return ballId + ':' + zeroFill(color[0], 3) + ',' +
        zeroFill(color[1], 3) + ',' + zeroFill(color[2], 3);
}

function zeroFill(number, size) {
    number = number.toString();
    while (number.length < size)
        number = '0' + number;
    return number;
}