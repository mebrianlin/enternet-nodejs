var _ = require('lodash');

module.exports = function(period) {
    if (!period)
        throw new RangeError('Period should be greater than 0.');

    var data = _.fill(Array(period), 0);
    var avg = 0;
    var index = 0;

    return {
        filter: filter,
        value: value
    };

    function filter(number) {
        avg -= data[index];
        avg += (data[index] = number / period);

        index = (index + 1) % period;
        return avg;
    }

    function value() {
        return avg;
    }
};
