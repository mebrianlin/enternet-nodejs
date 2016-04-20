var mqtt = require('mqtt');
var _ = require('lodash');

var color = require('../../color');
var ballManager = require('../ballManagerClient');

module.exports = {
     // enabled: true,
     init: init
};

var MAX_INDEX = 5;
var idx = 1;
var c = color.getRandomColor();

function init() {

setInterval(function() {
    changeColor();
}, 200);

}

function changeColor() {
    if (idx == MAX_INDEX) {
        c = color.getRandomColor();
    }
    idx = (idx % MAX_INDEX) + 1;
    ballManager.publishColor(idx, c);

    // for (var i = 1; i <= MAX_INDEX; ++i) {
    //     client.publish(publishToTopic,
    //         color.getPublishableColor(i, c));
    // }
}
