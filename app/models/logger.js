var moment = require('moment');
var util = require('util');
var winston = require('winston');

var levels = {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    silly: 5,

    mqtt: 3,
};

var colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    verbose: 'cyan',
    debug: 'blue',
    silly: 'magenta',

    mqtt: 'cyan'
};

winston.addColors(colors);
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: 'silly',
            timestamp: function() {
                return moment().format('MM/DD/YYYY HH:mm:ss.SSS');
            },
            formatter: function(options) {
                var label = winston.config.colorize(options.level,
                    util.format('[%s - %s]', options.timestamp(), options.level.toUpperCase()));
                var time = winston.config.colorize(options.level, options.timestamp());
                var method = winston.config.colorize(options.level, options.level.toUpperCase());
                var msg = options.message || '';
                var meta = options.meta && Object.keys(options.meta).length ?
                    '\n\t' + JSON.stringify(options.meta) : '';

                return util.format('%s %s%s', label, msg, meta);
            },
        }),
    ],
    levels: levels,
});

module.exports = logger;
