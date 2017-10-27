var express = require('express');        // Call express
var router = express.Router();              // get an instance of the express Router
var Promise = require('bluebird');

//models
var AirlineBooking = require('../models/airlineBooking');
var HaulierBooking = require('../models/haulierBooking');
var dtoBuilder = require('../functions/dto_transformer');

router.route('/')
    // Get all events(accessed at GET http://localhost:8080/api/bookings)
    .get(function (req, res) {
        Promise.props({
            airlineBookingEvents: AirlineBooking.find().execAsync(),
            haulierBookingEvents: HaulierBooking.find().execAsync()

        })
            .then(function (results) {
                var airlineBookings = new Array();
                var haulierBookings = new Array();
                results.airlineBookingEvents.forEach(function (flight, index) {
                    if (flight != undefined) {
                        airlineBookings.push(dtoBuilder.getDtoFromAirlineBooking(req.app, flight));
                    }
                });                
                results.haulierBookingEvents.forEach(function (cargo, index) {
                    if (cargo != undefined) {
                        haulierBookings.push(dtoBuilder.getDtoFromHaulierBooking(req.app, cargo));
                    }
                });
                results.airlineBookingEvents = airlineBookings;
                results.haulierBookingEvents = haulierBookings;
                res.json(results);
            })
            .catch(function (err) {
                res.send(err);
            });
    });

module.exports = router