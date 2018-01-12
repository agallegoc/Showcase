
// Models
var AirlineBookingDtoObject = require('../dto/airlineBookingDto');
var HaulierBookingDtoObject = require('../dto/haulierBookingDto');
var urlBuilder = require('../functions/build_reponse_url');

var self = module.exports = {
    //Get message from airlineBooking
    getDtoFromAirlineBooking: function (app, protocol, airlineBooking) {
        var dto = new AirlineBookingDtoObject.AirlineBookingDto();
        dto.bookingId = airlineBooking.bookingId;
        dto.trackingNumber = airlineBooking.trackingNumber;
        dto.airline = airlineBooking.airline;
        dto.flightNumber = airlineBooking.flightNumber;
        dto.origin = airlineBooking.origin;
        dto.destination = airlineBooking.destination;
        dto.departedTime = airlineBooking.departedTime;
        dto.arrivedTime = airlineBooking.arrivedTime;
        dto.status = airlineBooking.status;
        dto._links = Array.from(urlBuilder.getUrlsForAirlineBooking(app, protocol, airlineBooking));
        return dto;
    },

    //Get message from haulierBooking
    getDtoFromHaulierBooking: function (app, protocol, haulierBooking) {
        var dto = new HaulierBookingDtoObject.HaulierBookingDto();
        dto.bookingId = haulierBooking.bookingId;
        dto.trackingNumber = haulierBooking.trackingNumber;
        dto.supplierID = haulierBooking.supplierID;
        dto.origin = haulierBooking.origin;
        dto.destination = haulierBooking.destination;
        dto.pickedUpTime = haulierBooking.pickedUpTime;
        dto.deliveredTime = haulierBooking.deliveredTime;
        dto.status = haulierBooking.status;
        dto._links = Array.from(urlBuilder.getUrlsForHaulierBooking(app, protocol, haulierBooking));
        return dto;
    }
}
