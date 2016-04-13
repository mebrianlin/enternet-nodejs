var stats = require("stats-lite");

module.exports = outlier;

function outlier(windowSize) {
    var data = [];
    var numStdDev = 2;

    function push(val) {
        if (data.length === windowSize)
            data.shift();
        data.push(val);
    }

    function isOutlier(val) {
        if (data.length === 0)
            return false;

        var mean = stats.mean(data);
        var stddev = stats.stdev(data);
        // console.log(mean, stddev);
        if (val < mean - numStdDev * stddev || mean + numStdDev * stddev < val)
            return true;
        return false;
    }

    return {
        push: push,
        isOutlier: isOutlier
    };
}