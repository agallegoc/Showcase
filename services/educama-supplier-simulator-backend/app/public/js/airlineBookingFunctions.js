function confirmAirlineBooking(id) {

    $.ajax({
        type: "POST",
        url: "/api/airlinebooking/" + id + "/confirm",
        contentType: 'application/json',
        success: function (result) {
            location.reload();
        }
    });

}

function declineAirlineBooking(id) {

    $.ajax({
        type: "POST",
        url: "/api/airlinebooking/" + id + "/reject",
        contentType: 'application/json',
        success: function (result) {
            location.reload();
        }
    });

}

function departedFlight(id) {

    $.ajax({
        type: "POST",
        url: "/api/airlinebooking/" + id + "/departed",
        contentType: 'application/json',
        success: function (result) {
            location.reload();
        }
    });

}

function arrivedFlight(id) {

    $.ajax({
        type: "POST",
        url: "/api/airlinebooking/" + id + "/arrived",
        contentType: 'application/json',
        success: function (result) {
            location.reload();
        }
    });

}

