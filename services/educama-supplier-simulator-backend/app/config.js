"use strict";
var express = require('express');        // Call express
var app = express();                 // Define our app using express
var bodyParser = require('body-parser');
var cfenv = require("cfenv");
var appEnv = cfenv.getAppEnv();
var cors = require('cors');

module.exports = function (app) {
    app.set('port', process.env.PORT || 8080);
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true })); // It will let us get the data from a POST
    app.use(bodyParser.json());
    app.use('/', express.static(__dirname + '/www')); // redirect root
    app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // Redirect bootstrap JS
    app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // Redirect JS jQuery
    app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // Redirect CSS bootstrap
    app.use('/js', express.static(__dirname + '/public/js')); // Redirect personal JS

    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');

    // Rabbit mq url
    var amqpURL = appEnv.getServiceURL('supplier-simulator-queue');

    if (amqpURL === null) {     // Local or not found
        amqpURL = process.env.SUPPLIER_SIMULATOR_QUEUE;
    }
    app.set('amqpURL', amqpURL);

    //Mongo DB url
    var mongoURL = appEnv.getServiceURL("supplier-simulator-database");
    if (mongoURL === null) {         // Local or not found 
        mongoURL = process.env.SUPPLIER_SIMULATOR_DATABASE;
    }
    app.set('mongoURL', mongoURL);

    //application url
    var appURL = appEnv.url;

    if (appEnv.isLocal) {
        appURL = "http://localhost:8080";
    }
   
    app.set('appURL', appURL);
    console.log('Express server listening on ' + app.get('appURL'));
};