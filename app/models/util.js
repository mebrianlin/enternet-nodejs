var _ = require('lodash');

module.exports = {
    movingAverage: movingAverage
};

function movingAverage(period) {
    if (!period)
        throw new RangeError('The period should be greater than 0.');
    var data = _.fill(Array(period), 0);
    var avg = 0;
    var index = 0;
    return function (number) {
        avg -= data[index];
        avg += (data[index] = number / period);

        index = (index + 1) % period;
        return avg;
    };
}
