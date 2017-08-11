var express = require('express');        // Call express
var router = express.Router();              // get an instance of the express Router
var amqp = require('amqplib/callback_api'); // AMQP -- RabbitMQ

// Models
var HaulierBooking = require('../models/haulierBooking');
var message = require('../models/message');

router.route('/')

    // Create a haulier booking (accessed at POST http://localhost:8080/api/haulierbooking)
    .post(function (req, res) {

        var cargo = new HaulierBooking();      // Create a new instance of the haulierBooking model
        cargo.bookingId = req.body.bookingId;
        cargo.trackingNumber = req.body.trackingNumber;
        cargo.supplierID = req.body.supplierID;
        cargo.origin = req.body.origin;
        cargo.destination = req.body.destination;
        cargo.status = "Requested";
        cargo.pickedUpTime = null;
        cargo.deliveredTime = null;

        HaulierBooking.findOne({ 'bookingId': req.body.bookingId }, function (err, haulierBooking) {
            if (err) {
                console.log(err);
                res.status(500);
                res.send(err);
            } else {
                if (haulierBooking) {
                    //found--> can not be inserted
                    console.log('Error: Existing HaulierBooking with bookingId: %s.', haulierBooking.bookingId);
                    res.status(500);
                    res.send("Existing HaulierBooking with bookingId: " + haulierBooking.bookingId);
                } else {
                    // Save the Haulier Booking and check for errors
                    cargo.save(function (err) {
                        if (err) {
                            console.log(err);
                            res.status(500);
                            res.send(err);
                        } else {
                            console.log('HaulierBooking Sucessfully created %s.', cargo.bookingId);
                            res.status(201);
                            res.json(cargo);

                            // Connect to RabbitMQ server
                            amqp.connect(req.app.get('amqpURL'), function (err, conn) {
                                // Create a channel
                                conn.createChannel(function (err, ch) {
                                    var bookingResponseQueue = 'bookingResponseQueue';
                                    var msg = JSON.stringify(message.getMessageFromHaulierBooking(cargo));

                                    // Declare a queue for us to send to; then we can publish a message to the queue
                                    ch.assertQueue(bookingResponseQueue, { durable: false });
                                    ch.sendToQueue(bookingResponseQueue, new Buffer(msg));
                                });
                            });
                        }
                    });
                }
            }
        });
    })

    // Get all the haulier booking events (accessed at GET http://localhost:8080/api/haulierbooking)
    .get(function (req, res) {
        HaulierBooking.find(function (err, cargo) {
            if (err) {
                res.send(err);
            } else {
                res.json(cargo);
            }
        });
    });

router.route('/:booking_id')

    // Get the haulier booking event given the ID (accessed at GET http://localhost:8080/api/haulierbooking/:booking_id)
    .get(function (req, res) {
        HaulierBooking.findOne({ 'bookingId': req.params.booking_id }, function (err, cargo) {
            if (err) {
                console.log(err);
                res.status(500);
                res.send(err);
            } else {
                if (cargo) {
                    console.log("Haulier Booking with bookingId %s found", req.params.booking_id);
                    res.status(200);
                    res.json(cargo);
                } else {
                    console.log('Error: HaulierBooking with bookingId: %s not found', req.params.booking_id);
                    res.status(404);
                    res.send("HaulierBooking with bookingId: %s not found.", req.params.booking_id);
                }
            }
        });
    });

router.route('/:booking_id/confirm')
    // Update the haulier booking event given the ID (accessed at POST http://localhost:8080/api/haulierbooking/:booking_id/confirm)
    .post(function (req, res) {
        HaulierBooking.findOne({ 'bookingId': req.params.booking_id }, function (err, cargo) {
            if (err) {
                console.log(err);
                res.status(500);
                res.send(err);
            } else {
                if (cargo) {
                    cargo.status = "Confirmed";
                    cargo.save(function (err) {
                        if (err) {
                            console.log(err);
                            res.status(500);
                            res.send(err);
                        } else {
                            console.log("Haulier Booking with bookingId %s updated to Confirmed status", req.params.booking_id);
                            res.status(200);
                            res.json(cargo);
                        }
                    });
                    // Connect to RabbitMQ server
                    amqp.connect(req.app.get('amqpURL'), function (err, conn) {
                        // Create a channel
                        conn.createChannel(function (err, ch) {
                            var bookingResponseQueue = 'bookingResponseQueue';
                            var msg = JSON.stringify(message.getMessageFromAirlineBooking(cargo));

                            // Declare a queue for us to send to; then we can publish a message to the queue
                            ch.assertQueue(bookingResponseQueue, { durable: false });
                            ch.sendToQueue(bookingResponseQueue, new Buffer(msg));
                        });

                    });
                } else {
                    console.log('Error: HaulierBooking with bookingId: %s not found', req.params.booking_id);
                    res.status(404);
                    res.send("HaulierBooking with bookingId: %s not found.", req.params.booking_id);
                }
            }
        });
    });

router.route('/:booking_id/reject')
    // Update the haulier booking event given the ID (accessed at POST http://localhost:8080/api/haulierbooking/:booking_id/reject)
    .post(function (req, res) {
        HaulierBooking.findOne({ 'bookingId': req.params.booking_id }, function (err, cargo) {
            if (err) {
                console.log(err);
                res.status(500);
                res.send(err);
            } else {
                if (cargo) {
                    cargo.status = "Declined";
                    cargo.save(function (err) {
                        if (err) {
                            console.log(err);
                            res.status(500);
                            res.send(err);
                        } else {
                            console.log("Haulier Booking with bookingId %s updated to Declined status", req.params.booking_id);
                            res.status(200);
                            res.json(cargo);
                        }
                    });
                    // Connect to RabbitMQ server
                    amqp.connect(req.app.get('amqpURL'), function (err, conn) {
                        // Create a channel
                        conn.createChannel(function (err, ch) {
                            var bookingResponseQueue = 'bookingResponseQueue';
                            var msg = JSON.stringify(message.getMessageFromAirlineBooking(cargo));

                            // Declare a queue for us to send to; then we can publish a message to the queue
                            ch.assertQueue(bookingResponseQueue, { durable: false });
                            ch.sendToQueue(bookingResponseQueue, new Buffer(msg));
                        });

                    });
                } else {
                    console.log('Error: HaulierBooking with bookingId: %s not found', req.params.booking_id);
                    res.status(404);
                    res.send("HaulierBooking with bookingId: %s not found.", req.params.booking_id);
                }
            }
        });
    });

router.route('/:booking_id/pickedup')
    // Update the haulier booking event given the ID (accessed at POST http://localhost:8080/api/haulierbooking/:booking_id/departed)
    .post(function (req, res) {
        HaulierBooking.findOne({ 'bookingId': req.params.booking_id }, function (err, cargo) {
            if (err) {
                console.log(err);
                res.status(500);
                res.send(err);
            } else {
                if (cargo) {
                    cargo.status = "PickedUp";
                    cargo.pickedUpTime = new Date();
                    cargo.save(function (err) {
                        if (err) {
                            console.log(err);
                            res.status(500);
                            res.send(err);
                        } else {
                            console.log("Haulier Booking with bookingId %s updated to PickedUp status", req.params.booking_id);
                            res.status(200);
                            res.json(cargo);
                        }
                    });
                    // Connect to RabbitMQ server
                    amqp.connect(req.app.get('amqpURL'), function (err, conn) {
                        // Create a channel
                        conn.createChannel(function (err, ch) {
                            var bookingResponseQueue = 'bookingResponseQueue';
                            var msg = JSON.stringify(message.getMessageFromAirlineBooking(cargo));

                            // Declare a queue for us to send to; then we can publish a message to the queue
                            ch.assertQueue(bookingResponseQueue, { durable: false });
                            ch.sendToQueue(bookingResponseQueue, new Buffer(msg));
                        });

                    });
                } else {
                    console.log('Error: HaulierBooking with bookingId: %s not found', req.params.booking_id);
                    res.status(404);
                    res.send("HaulierBooking with bookingId: %s not found.", req.params.booking_id);
                }
            }
        });
    });

router.route('/:booking_id/delivered')

    // Update the haulier booking event given the ID (accessed at POST http://localhost:8080/api/haulierbooking/:booking_id/arrived)
    .post(function (req, res) {
        HaulierBooking.findOne({ 'trackingNumber': req.params.booking_id }, function (err, cargo) {
            if (err) {
                console.log(err);
                res.status(500);
                res.send(err);
            } else {
                if (cargo) {
                    cargo.status = "Delivered";
                    cargo.deliveredTime = new Date();
                    cargo.save(function (err) {
                        if (err) {
                            console.log(err);
                            res.status(500);
                            res.send(err);
                        } else {
                            console.log("Haulier Booking with bookingId %s updated to Delivered status", req.params.booking_id);
                            res.status(200);
                            res.json(cargo);
                        }
                    });
                    // Connect to RabbitMQ server
                    amqp.connect(req.app.get('amqpURL'), function (err, conn) {
                        // Create a channel
                        conn.createChannel(function (err, ch) {
                            var bookingResponseQueue = 'bookingResponseQueue';
                            var msg = JSON.stringify(message.getMessageFromAirlineBooking(cargo));

                            // Declare a queue for us to send to; then we can publish a message to the queue
                            ch.assertQueue(bookingResponseQueue, { durable: false });
                            ch.sendToQueue(bookingResponseQueue, new Buffer(msg));
                        });

                    });
                } else {
                    console.log('Error: HaulierBooking with bookingId: %s not found', req.params.booking_id);
                    res.status(404);
                    res.send("HaulierBooking with bookingId: %s not found.", req.params.booking_id);
                }
            }
        });
    });

module.exports = router