
// Models
var LinkDto = require('../dto/link');

var self = module.exports = {
    //Get urls from airlineBooking
    getUrlsForAirlineBooking: function (app, airlineBooking) {
        var urls = new Map(); 
        urlBase = app.get('appURL') + '/api/airlineBooking/' + airlineBooking.bookingId;
        urls.set("self", getUrlData("GET", urlBase));

        if (airlineBooking.status == "Requested") {
            urls.set("confirm", getUrlData("POST", urlBase + "/confirm"));
            urls.set("reject", getUrlData("POST", urlBase + "/reject"));
        } else if (airlineBooking.status == "Confirmed") {
            urls.set("departed", getUrlData("POST", urlBase + "/departed"));
        } else if (airlineBooking.status == "Departed") {
            urls.set("arrived", getUrlData("POST", urlBase + "/arrived"));
        }
        return urls;
    },

    //Get url from haulierBooking
    getUrlsForHaulierBooking: function (app, haulierBooking) {
        var urls = new Map(); 
        urlBase = app.get('appURL') + '/api/haulierbooking/' + haulierBooking.bookingId;
        urls.set("self", getUrlData("GET", urlBase));

        if (haulierBooking.status == "Requested") {
            urls.set("confirm", getUrlData("POST", urlBase + "/confirm"));
            urls.set("reject", getUrlData("POST", urlBase + "/reject"));
        } else if (haulierBooking.status == "Confirmed") {
            urls.set("pickedup", getUrlData("POST", urlBase + "/pickedup"));
        } else if (haulierBooking.status == "PickedUp") {
            urls.set("delivered", getUrlData("POST", urlBase + "/delivered"));
        }
        return urls;
    }
}

/**
 * Fill in the Url Data
 */
function getUrlData(method, url) {
    var linkData = new LinkDto.Link();
    linkData.method = method;
    linkData.href = url;
    return linkData;
}



