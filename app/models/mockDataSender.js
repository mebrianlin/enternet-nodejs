module.exports = {
    start: start,
    stop: stop
};

var intervalId;
var interval = 1000;

function start(client) {
    // intervalId = setInterval(function() {
    //     client.publish('ball/put', JSON.stringify({
    //         fake: true,
    //         id: 'fake',
    //         acceleration: Math.random() * 9.8,
    //         rssi: {
    //             1: 0,
    //             2: 0,
    //             3: 0
    //         }
    //     }));
    // }, interval);

    // setInterval(function() {
    //     client.publish('ball/get', getPublishableColor(1, {
    //         r: getRandomInt(0, 100),
    //         g: getRandomInt(0, 100),
    //         b: getRandomInt(0, 100)
    //     }));
    // }, 100);
}

function stop() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}