module.exports = {
    // enabled: true,
    start: start,
    stop: stop
};

var intervalId;
var interval = 1000;

function start(client, titles) {
    intervalId = setInterval(function() {
        client.publish(titles.put, JSON.stringify({
            fake: true,
            id: 'fake',
            acceleration: Math.random() * 9.8,
            rssi: {
                1: 0,
                2: 0,
                3: 0
            }
        }));
    }, interval);
}

function stop() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}