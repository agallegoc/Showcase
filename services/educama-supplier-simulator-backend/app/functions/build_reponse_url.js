
// Models
var LinkDto = require('../dto/link');

var self = module.exports = {
    //Get urls from airlineBooking
    getUrlsForAirlineBooking: function (app, protocol, airlineBooking) {
        var urls = new Map(); 
        urlBase = getCorrectSchemaUrlBase(app.get('appURL'), protocol) + '/api/airlineBooking/' + airlineBooking.bookingId;
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
    getUrlsForHaulierBooking: function (app, protocol, haulierBooking) {
        var urls = new Map(); 
        urlBase = getCorrectSchemaUrlBase(app.get('appURL'), protocol) + '/api/haulierbooking/' + haulierBooking.bookingId;
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

/**
 * Get the correct url Schema
 */
function getCorrectSchemaUrlBase(urlBase, protocol) {
    if (protocol == 'http' && urlBase.startsWith("https")) {
        return urlBase.replace("https", "http")
    } else if (protocol == 'https' && !urlBase.startsWith("https")) {
        return urlBase.replace("http", "https")
    }
    return urlBase;
}



