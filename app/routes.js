var config = require('./config');
var activityManager = require('./models/activityManager');
var ballHandler = require('./models/mqtt-clients/enternetBallClient');
var recordManager = require('./models/mqtt-clients/recordManagerClient');

module.exports = function(app) {
    // server routes ===========================================================
    // handle things like api calls
    // authentication routes
    app.get('/api/balls/get', function(req, res) {
        var balls = ballHandler.getBalls();
        res.send(balls);
    });

    app.get('/api/records/get', function(req, res) {
        var records = recordManager.getRecords();
        res.send(records);
    });

    app.get('/api/activity/get', function(req, res) {
        res.send(activityManager.getActivityNames());
    });

    app.get('/api/activity/change/:name', function(req, res) {
        var activityName = req.params.name;
        res.send(activityManager.changeActivity(activityName));
    });

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        console.log(req.method, req.path);
        // res.sendfile('./public/index.html');
        res.render('index', {
            mqttBrokers: config.mqttBrokers
        });
    });

    // catch 404 and forward to error handler
    // app.use(function(req, res, next) {
    //     var err = new Error('Not Found');
    //     err.status = 404;
    //     next(err);
    // });

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
};