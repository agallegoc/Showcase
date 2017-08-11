var self = module.exports = {
    // This is going to be the object that will be sent from and to the queue
    // trackingNumber must be different between 
    Message: function () {
        var eventType;
        var bookingId;
        var trackingNumber;
        var airline;
        var flightNumber;
        var origin;
        var destination;
        var departedTime;
        var arrivedTime;
        var status;
        var supplierID;
        var pickedUpTime;
        var deliveredTime;
    },
    //Get message from airlineBooking
    getMessageFromAirlineBooking: function (airlineBooking) {
        var message = new self.Message();
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
        var message = new self.Message();
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
    }
}