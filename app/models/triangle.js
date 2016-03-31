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

function randomInRange(a, b) {
    var range = Math.abs(b - a);
    return Math.random() * range + Math.min(a, b);
}

function isTrangle(d1331, d1221, d2332){
    if(d1331+d1221 <= d2332 || d1331+d2332 <= d1221 ||
        d1221+d2332 <= d1331)
        return false;
    return true;
}

function triangleRandom(d12, d13, d21, d23, d31, d32, times) {
    times = 100;
    var d1331 = (d31+d13)/2;
    var d1221 = (d21+d12)/2;
    var d2332 = (d32+d23)/2;
    var isPass = false;
    for(i = 0; i < times; i++){
        d1331 = randomInRange(d31,d13);
        d1221 = randomInRange(d21,d12);
        d2332 = randomInRange(d32,d23);
        if(isTrangle(d1331, d1221, d2332)){
            isPass = true;
            break;
        }
    }
    if(!isPass) return;
    d1331 *= d1331;
    d2332 *= d2332;
    var x = (d1331 - d2332 + d1221*d1221) / (2 * d1221);
    var y = Math.sqrt(d1331 - x*x);
    var points = [0, 0, d1221, 0, x, y];
    return points;
}

// triangle(13, 20, 15, 7, 21, 8);