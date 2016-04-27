var mqtt = require('mqtt');
var _ = require('lodash');

var color = require('../../color');
var ballManager = require('../ballManagerClient');

module.exports = {
     init: init,
     deinit: deinit
};

var MAX_INDEX = 5;
var idx = 1;
var refreshIntervalId;
var c = color.getRandomColor();

function init() {
    // don't init twice
    if (refreshIntervalId)
        return;

    refreshIntervalId = setInterval(function() {
        changeColor();
    }, 1000);
}

function deinit() {
    clearInterval(refreshIntervalId);
    refreshIntervalId = null;
}

function changeColor() {
    // if (idx == MAX_INDEX) {
    //     c = color.getRandomColor();
    // }
    // idx = (idx % MAX_INDEX) + 1;
    // ballManager.changeColor(idx, c);

    c = color.getRandomColor();
    for (idx = 1; idx <= MAX_INDEX; ++idx) {
        ballManager.changeColor(idx, c);
    }
}
