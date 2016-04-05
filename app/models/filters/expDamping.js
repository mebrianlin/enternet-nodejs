var _ = require('lodash');

module.exports = function() {
    var damping = 0.85;
    var avg = 0;

    return {
        filter: filter,
        value: value
    };

    function filter(number) {
        avg = number * damping + avg * (1 - damping);
        return avg;
    }

    function value() {
        return avg;
    }
};
