module.exports = function() {
    var avg = 0;

    return {
        filter: filter,
        value: value
    };

    function filter(number) {
        avg = number;
        return number;
    }

    function value() {
        return avg;
    }
};
