var self = module.exports = {
    // This is going to be the object that will be sent from and to the queue
    // trackingNumber must be different between different instances
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
    }
}