// modules =================================================
var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('./app/models/logger');
var mqttClient = require('./app/models/mqttClient')();
var config = require('./app/config');
// configuration ===========================================

// config files
var db = require('./config/db');

var port = process.env.PORT || config.ports.httpPort; // set our port
var mqttPort = config.ports.mqttPort;
// mongoose.connect(db.url); // connect to our mongoDB database (commented out after you enter in your own credentials)

// spin up the mqtt broker
require('./app/models/mqttBroker')();

mqttClient.connect(config.mqttBrokers['shiftr'].mqttUrl, {
   clientId: 'enternet'
});

// view engine setup
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT

app.use(express.static(path.join(__dirname, 'public'))); // set the static files location /public/img will be /img for users

// routes ==================================================
require('./app/routes')(app); // pass our application into our routes

// start app ===============================================
app.listen(port);
logger.info('Listening on port ' + port);  // shoutout to the user

exports = module.exports = app; // expose app