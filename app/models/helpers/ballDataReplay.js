var readline = require('readline');
var path = require('path');
var fs = require('fs');

module.exports = {
    enabled: true,
    start: start,
    stop: stop
};

var ballsDump = [];

var rl = readline.createInterface({
    input: fs.createReadStream(path.join(__dirname, '../../../balls.dump'))
});

rl.on('line', function(line) {
    ballsDump.push(JSON.parse(line));
});

var intervalId;
var interval = 1000;

function start(client, titles) {
    var index = 0;

    intervalId = setInterval(function() {
        console.log(ballsDump[index].data);
        client.publish(titles.get, JSON.stringify(ballsDump[index].data));
        index = (index + 1) % ballsDump.length;
    }, interval);
}

function stop() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}