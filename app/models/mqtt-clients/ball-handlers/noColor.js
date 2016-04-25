var mqtt = require('mqtt');
var _ = require('lodash');

var color = require('../../color');
var ballManager = require('../ballManagerClient');

module.exports = {
     update: update
};

function update(ballId) {
    ballManager.changeColor(ballId, color.Black);
}
