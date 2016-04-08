var _ = require('lodash');

module.exports = function(period, weights) {
    if (!period)
        throw new RangeError('Period should be greater than 0.');
    if (weights.length !== period)
        throw new RangeError('Period should match the legnth of weights.');

    var data = _.fill(Array(period), 0);
    var avg = 0;

    return {
        filter: filter,
        value: value
    };

    function filter(number) {
        data.shift();
        data.push(number);

        avg = 0;
        for (var i = 0; i < period; ++i)
            avg += data[i] * weights[i];

        return avg;
    }

    function value() {
        return avg;
    }
};
