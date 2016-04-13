module.exports = {
    toDistance: toDistance
};

function toDistance(rssi) {
    if (rssi >= 0 || rssi <= -255)
        return 0;
    var n = 2;
    var A = -45; // received signal strength (dBm) at 1 meter
    // RSSI = -10nlogd + A
    return Math.pow(10, (A - rssi) / (10 * n));
}