module.exports = {
    isValid: isValid,
    toDistance: toDistance
};

function isValid(rssi) {
    return -255 < rssi && rssi < 0;
}

function toDistance(rssi) {
    if (!isValid(rssi))
        return 0;
    var n = 2;
    var A = -45; // received signal strength (dBm) at 1 meter
    // RSSI = -10nlogd + A
    return Math.pow(10, (A - rssi) / (10 * n));
}