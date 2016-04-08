
module.exports = function() {

    var lastTime = Date.now();
    var smoothing = 10; // if this is 1, there is no smoothing
    var smoothedValue = 0;

    return {
        filter: filter,
        value: value
    };

    function filter(number) {
        var now = Date.now();
        var timeSinceLastUpdate = now - lastTime;
        lastTime = now;

        smoothedValue += timeSinceLastUpdate * (number - smoothedValue) / smoothing;

        return avg;
    }

    function value() {
        return avg;
    }
};
