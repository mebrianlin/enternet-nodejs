var mqtt = require('mqtt');
var fs = require('fs');

module.exports = {
    enabled: true,
    connect: connect,
    end: end,
    getRecord: getRecord,
    getRecords: getRecords,
    updateRecord: updateRecord,
    publishRecord: publishRecord
};

var client;
var records = {};

readRecord();

function connect(url, options) {
    client = mqtt.connect(url, options);
}

function end() {
    if (client) {
        client.end();
    }
}

function getRecord(key) {
    return records[key];
}

function getRecords() {
    return records;
}

function updateRecord(key, record) {
    records[key] = record;
    // write to file
    var text = JSON.stringify(records);
    fs.writeFile('leaderboard.txt', text, function(err) {
        if (err) {
            console.log(err);
            return;
        }

        console.log('Leaderboard written to file.');
    });
}

function publishRecord(topic, msg) {
    client.publish(topic, msg);
}

function readRecord() {
    // read from file
    fs.readFile('leaderboard.txt', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        try {
            records = JSON.parse(data);
        }
        catch (ex) {
            console.error(ex);
        }
    });
}
