var messageTransformer = require('./message_transformer');
var messageSender = require('./queue_message_sender');
// Models
var AirlineBooking = require('../models/airlineBooking');
var HaulierBooking = require('../models/haulierBooking');
var message = require('../models/message');

/*
*Function to proccess queue messages
*/
exports.process_message = function (app, textMessage) {
    try {
        var message = JSON.parse(textMessage);
        console.log("Object:" + JSON.stringify(message));
        console.log("Object type: %s", message.eventType);
        if (message.eventType === "airlineBooking") {
            var airlineBooking = messageTransformer.getAirlineBookingFromMessage(message);
            console.log("After parse AirlineBooking");
            processAirlineBooking(app, airlineBooking);
        } else if (message.eventType === "haulierBooking") {
            var haulierBooking = messageTransformer.getHaulierBookingFromMessage(message);
            console.log("After parse haulierBooking");
            processHaulierBooking(app, haulierBooking);
        } else {
            console.log("Error: Message type %s not found", message.eventType);
        }
    } catch (err) {
        console.log("Error" + err);
    }
}

/*
*Proccess messages of type Airline Booking
*/
function processAirlineBooking(app, abOject) {
    console.log("Processing airlineBooking with id %s", abOject.bookingId);
    if (hasAirlineBookingRequiredFields(abOject)) {
        AirlineBooking.findOne({ 'bookingId': abOject.bookingId }, function (err, airline) {
            if (err) {
                console.log(err);
            } else {
                if (airline) {
                    //found--> can not be inserted
                    console.log('Error: Existing AirlineBooking with bookingId: %s.', abOject.bookingId);
                } else {
                    console.log('AirlineBooking with bookingId: %s not found: create one', abOject.bookingId);
                    airline = new AirlineBooking();      // Create a new instance of the airlineBooking model
                    airline.bookingId = abOject.bookingId;
                    airline.trackingNumber = abOject.trackingNumber;
                    airline.airline = abOject.airline;
                    airline.flightNumber = abOject.flightNumber;
                    airline.origin = abOject.origin;
                    airline.destination = abOject.destination;
                    airline.status = "Requested";
                    //save the new object
                    airline.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Airline Booking with bookingId %s created", abOject.bookingId);
                            // sent message to the queue
                            messageSender.sentHaulierBookingMessageToQueue(app, airline);
                        }
                    });

                }
            }
        });
    } else {
        console.log('Error: Required fields missed');
    }
}

/**
 * Check that the request has all fields required
 */
function hasAirlineBookingRequiredFields(airlineBooking) {
    if (airlineBooking.bookingId && airlineBooking.bookingId.length > 0 && airlineBooking.trackingNumber && airlineBooking.trackingNumber.length > 0 && airlineBooking.airline && airlineBooking.airline.length > 0
        && airlineBooking.flightNumber && airlineBooking.flightNumber.length > 0 && airlineBooking.origin && airlineBooking.origin.length > 0 && airlineBooking.destination && airlineBooking.destination.length > 0) {
        return true;
    }
    return false;
}

/*
*Proccess messages of type haulier Booking
*/
function processHaulierBooking(app, hbObject) {
    console.log("Processing haulierBooking with id %s", hbObject.bookingId);
    if (hasHauliereBookingRequiredFields(hbObject)) {
        HaulierBooking.findOne({ 'bookingId': hbObject.bookingId }, function (err, haulier) {
            if (err) {
                console.log(err);
            } else {
                if (haulier) {
                    //found--> can not be inserted
                    console.log('Error: Existing HaulierBooking with bookingId: %s.', hbObject.bookingId);
                } else {
                    console.log('HaulierBooking with bookingId: %s not found: Create one', hbObject.bookingId);
                    haulier = new HaulierBooking();      // Create a new instance of the haulierBooking model
                    haulier.bookingId = hbObject.bookingId;
                    haulier.trackingNumber = hbObject.trackingNumber;
                    haulier.supplierID = hbObject.supplierID;
                    haulier.origin = hbObject.origin;
                    haulier.destination = hbObject.destination;
                    haulier.status = "Requested";
                    //save the new object
                    haulier.save(function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Haulier Booking with bookingId created", haulier.bookingId);
                            // sent message to the queue
                            messageSender.sentHaulierBookingMessageToQueue(app, haulier);
                        }
                    });
                }
            }
        });
    } else {
        console.log('Error: Required fields missed');
    }
}

/**
 * Check that the request has all fields required
 */
function hasHauliereBookingRequiredFields(haulierBooking) {
    if (haulierBooking.bookingId && haulierBooking.bookingId.length > 0 && haulierBooking.trackingNumber && haulierBooking.trackingNumber.length > 0 && haulierBooking.supplierID
        && haulierBooking.supplierID.length > 0 && haulierBooking.origin && haulierBooking.origin.length > 0 && haulierBooking.destination && haulierBooking.destination.length > 0) {
        return true;
    }
    return false;
}