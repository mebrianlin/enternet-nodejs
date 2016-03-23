module.exports = triangle;

function triangle(d12, d13, d21, d23, d31, d32) {
    var d1331 = (d31+d13)/2;
    var d1221 = (d21+d12)/2;
    var d2332 = (d32+d23)/2;
    if(d1331+d1221 <= d2332 || d1331+d2332 <= d1221 ||
        d1221+d2332 <= d1331)
        return;
    d1331 *= d1331;
    d2332 *= d2332;
    var x = (d1331 - d2332 + d1221*d1221) / (2 * d1221);
    var y = Math.sqrt(d1331 - x*x);
    var points = [0, 0, d1221, 0, x, y];
    return points;
}

// triangle(13, 20, 15, 7, 21, 8);