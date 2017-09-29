
// Models
var AirlineBooking = require('../models/airlineBooking');
var HaulierBooking = require('../models/haulierBooking');
var messageObject = require('../models/message');

var self = module.exports = {
    //Get message from airlineBooking
    getMessageFromAirlineBooking: function (airlineBooking) {
        var message = new messageObject.Message();
        message.eventType = "airlineBooking";
        message.bookingId = airlineBooking.bookingId;
        message.trackingNumber = airlineBooking.trackingNumber;
        message.airline = airlineBooking.airline;
        message.flightNumber = airlineBooking.flightNumber;
        message.origin = airlineBooking.origin;
        message.destination = airlineBooking.destination;
        message.departedTime = airlineBooking.departedTime;
        message.arrivedTime = airlineBooking.arrivedTime;
        message.status = airlineBooking.status;
        return message;
    },

    //Get message from haulierBooking
    getMessageFromHaulierBooking: function (haulierBooking) {
        var message = new messageObject.Message();
        message.eventType = "haulierBooking";
        message.bookingId = haulierBooking.bookingId;
        message.trackingNumber = haulierBooking.trackingNumber;
        message.supplierID = haulierBooking.supplierID;
        message.origin = haulierBooking.origin;
        message.destination = haulierBooking.destination;
        message.pickedUpTime = haulierBooking.pickedUpTime;
        message.deliveredTime = haulierBooking.deliveredTime;
        message.status = haulierBooking.status;
        return message;
    },

    //Get airlineBooking from message
    getAirlineBookingFromMessage: function (message) {
        var airlineBooking = new AirlineBooking();
        airlineBooking.bookingId = message.bookingId;
        airlineBooking.trackingNumber = message.trackingNumber;
        airlineBooking.airline = message.airline;
        airlineBooking.flightNumber = message.flightNumber;
        airlineBooking.origin = message.origin;
        airlineBooking.destination = message.destination;
        airlineBooking.departedTime = message.departedTime;
        airlineBooking.arrivedTime = message.arrivedTime;
        airlineBooking.status = message.status;
        return airlineBooking;
    },

    //Get haulierBooking from message
    getHaulierBookingFromMessage: function (message) {
        var haulierBooking = new HaulierBooking();
        haulierBooking.bookingId = message.bookingId;
        haulierBooking.trackingNumber = message.trackingNumber;
        haulierBooking.supplierID = message.supplierID;
        haulierBooking.origin = message.origin;
        haulierBooking.destination = message.destination;
        haulierBooking.pickedUpTime = message.pickedUpTime;
        haulierBooking.deliveredTime = message.deliveredTime;
        haulierBooking.status = message.status;
        return haulierBooking;
    }
}