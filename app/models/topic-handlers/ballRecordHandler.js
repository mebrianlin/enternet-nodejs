var fs = require('fs');
var os = require('os');

var logger = require('../logger');

module.exports = {
   topic: 'ball/put',
   handler: ballRecordhandler
};

var enableRecording = false;

if (enableRecording)
    logger.log('warn', 'Recording is enabled');
else
    logger.log('info', 'Recording is disabled');

function ballRecordhandler(client, message) {
    if (!enableRecording) {
        return;
    }

    var str = message.toString();

    // forcefully fix malformed json
    str = str.replace(', }', '}}');
    var ballData = JSON.parse(str);

    var text = JSON.stringify({
        data: ballData,
        time: Date.now()
    });

    fs.appendFile('balls.dump', text + os.EOL, function(err) {
        if (err) {
            console.log(err);
            return;
        }

        console.log('Recording ball data.');
    });
}
