var express = require('express');        // Call express
var router = express.Router();              // get an instance of the express Router

// Models
var AirlineBooking = require('../models/airlineBooking');
var messageSender = require('../functions/queue_message_sender');
var dtoBuilder = require('../functions/dto_transformer');

router.route('/')

    // Create an airline booking (accessed at POST http://localhost:8080/api/airlinebooking)
    .post(function (req, res) {

        var flight = new AirlineBooking();      // Create a new instance of the airlineBooking model
        flight.bookingId = req.body.bookingId;
        flight.trackingNumber = req.body.trackingNumber;
        flight.airline = req.body.airline;
        flight.flightNumber = req.body.flightNumber;
        flight.origin = req.body.origin;
        flight.destination = req.body.destination;
        flight.status = "Requested";
        flight.departedTime = null;
        flight.arrivedTime = null;

        AirlineBooking.findOne({ 'bookingId': req.body.bookingId }, function (err, airlineBooking) {
            if (err) {
                console.log(err);
                res.status(500);
                res.send(err);
            } else {
                if (airlineBooking) {
                    //found--> can not be inserted
                    console.log('Error: Existing AirlineBooking with bookingId: %s.', airlineBooking.bookingId);
                    res.status(500);
                    res.send("Existing AirlineBooking with bookingId: " + airlineBooking.bookingId);
                } else {
                    // Save the flight and check for errors
                    flight.save(function (err) {
                        if (err) {
                            console.log(err);
                            res.status(500);
                            res.send(err);
                        } else {
                            console.log('AirlineBooking Sucessfully created %s.', flight.bookingId);
                            res.status(201);
                            res.json(dtoBuilder.getDtoFromAirlineBooking(req.app, req.protocol ,flight));
                            // sent message to the queue
                            messageSender.sentAirlineBookingtMessageToQueue(req.app, flight);
                        }
                    });
                }
            }
        });
    })

    // Get all the airline booking events (accessed at GET http://localhost:8080/api/airlinebooking)
    .get(function (req, res) {
        AirlineBooking.find(function (err, flights) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                var flightsDto = new Array();
                flights.forEach(function (flight, index) {
                    flightsDto.push(dtoBuilder.getDtoFromAirlineBooking(req.app, req.protocol, flight));
                });
                res.json(flightsDto);
            }
        });
    });

router.route('/:booking_id')

    // Get the airline booking event given the ID (accessed at GET http://localhost:8080/api/airlinebooking/:booking_id)
    .get(function (req, res) {
        AirlineBooking.findOne({ 'bookingId': req.params.booking_id }, function (err, flight) {
            if (err) {
                console.log(err);
                res.status(500);
                res.send(err);
            } else {
                if (flight) {
                    console.log("AirlineBooking with bookingIdr %s found", req.params.booking_id);
                    res.status(200);
                    res.json(dtoBuilder.getDtoFromAirlineBooking(req.app, req.protocol, flight));
                } else {
                    console.log('Error: AirlineBooking with bookingId: %s not found', req.params.booking_id);
                    res.status(404);
                    res.send("AirlineBooking with tracking Number: %s not found.", req.params.booking_id);
                }
            }
        });
    });

router.route('/:booking_id/confirm')
    // Update the airline booking event given the ID (accessed at POST http://localhost:8080/api/airlinebooking/:booking_id/confirm)
    .post(function (req, res) {
        AirlineBooking.findOne({ 'bookingId': req.params.booking_id }, function (err, flight) {
            if (err) {
                console.log(err);
                res.status(500);
                res.send(err);
            } else {
                if (flight) {
                    flight.status = "Confirmed";
                    flight.save(function (err) {
                        if (err) {
                            console.log(err);
                            res.status(500);
                            res.send(err);
                        } else {
                            console.log("AirlineBooking with bookingId %s updated to Confirmed status", req.params.booking_id);
                            res.status(200);
                            res.json(dtoBuilder.getDtoFromAirlineBooking(req.app, req.protocol, flight));
                            // sent message to the queue
                            messageSender.sentAirlineBookingtMessageToQueue(req.app, flight);
                        }
                    });
                } else {
                    console.log('Error: AirlineBooking with bookingId: %s not found', req.params.booking_id);
                    res.status(404);
                    res.send("AirlineBooking with bookingId: %s not found.", req.params.booking_id);
                }
            }
        });
    });

router.route('/:booking_id/reject')
    // Update the airline booking event given the ID (accessed at POST http://localhost:8080/api/airlinebooking/:booking_id/reject)
    .post(function (req, res) {
        AirlineBooking.findOne({ 'bookingId': req.params.booking_id }, function (err, flight) {
            if (err) {
                console.log(err);
                res.status(500);
                res.send(err);
            } else {
                if (flight) {
                    flight.status = "Declined";
                    flight.save(function (err) {
                        if (err) {
                            console.log(err);
                            res.status(500);
                            res.send(err);
                        } else {
                            console.log("AirlineBooking with bookingId %s updated to Declined status", req.params.booking_id);
                            res.status(200);
                            res.json(dtoBuilder.getDtoFromAirlineBooking(req.app, req.protocol, flight));
                            // sent message to the queue
                            messageSender.sentAirlineBookingtMessageToQueue(req.app, flight);
                        }
                    });
                } else {
                    console.log('Error: AirlineBooking with bookingId: %s not found', req.params.booking_id);
                    res.status(404);
                    res.send("AirlineBooking with bookingId: %s not found.", req.params.booking_id);
                }
            }
        });
    });

router.route('/:booking_id/departed')
    // Update the airline booking event given the ID (accessed at POST http://localhost:8080/api/airlinebooking/:booking_id/departed)
    .post(function (req, res) {
        AirlineBooking.findOne({ 'bookingId': req.params.booking_id }, function (err, flight) {
            if (err) {
                console.log(err);
                res.status(500);
                res.send(err);
            } else {
                if (flight) {
                    flight.status = "Departed";
                    flight.departedTime = new Date();
                    flight.save(function (err) {
                        if (err) {
                            console.log(err);
                            res.status(500);
                            res.send(err);
                        } else {
                            console.log("AirlineBooking with bookingId %s updated to Departed status", req.params.booking_id);
                            res.status(200);
                            res.json(dtoBuilder.getDtoFromAirlineBooking(req.app, flight));
                            // sent message to the queue
                            messageSender.sentAirlineBookingtMessageToQueue(req.app, req.protocol, flight);
                        }
                    });
                } else {
                    console.log('Error: AirlineBooking with bookingId: %s not found', req.params.booking_id);
                    res.status(404);
                    res.send("AirlineBooking with bookingId: %s not found.", req.params.booking_id);
                }
            }
        });
    });

router.route('/:booking_id/arrived')

    // Update the airline booking event given the ID (accessed at POST http://localhost:8080/api/airlinebooking/:booking_id/arrived)
    .post(function (req, res) {
        AirlineBooking.findOne({ 'bookingId': req.params.booking_id }, function (err, flight) {
            if (err) {
                console.log(err);
                res.status(500);
                res.send(err);
            } else {
                if (flight) {
                    flight.status = "Arrived";
                    flight.arrivedTime = new Date();
                    flight.save(function (err) {
                        if (err) {
                            console.log(err);
                            res.status(500);
                            res.send(err);
                        } else {
                            console.log("AirlineBooking with bookingId %s updated to Arrived status", req.params.booking_id);
                            res.status(200);
                            res.json(dtoBuilder.getDtoFromAirlineBooking(req.app, req.protocol, flight));
                            // sent message to the queue
                            messageSender.sentAirlineBookingtMessageToQueue(req.app, flight);
                        }
                    });
                } else {
                    console.log('Error: AirlineBooking with bookingId: %s not found', req.params.booking_id);
                    res.status(404);
                    res.send("AirlineBooking with bookingId: %s not found.", req.params.booking_id);
                }
            }
        });
    });

module.exports = router
