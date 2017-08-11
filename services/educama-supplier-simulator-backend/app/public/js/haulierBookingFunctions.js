function confirmHaulierBooking(id) {

    $.ajax({
        type: "POST",
        url: "/api/haulierbooking/" + id + "/confirm",
        contentType: 'application/json',
        success: function (result) {
            location.reload();
        }
    });

}

function declineHaulierBooking(id) {

    $.ajax({
        type: "POST",
        url: "/api/haulierbooking/" + id + "/reject",
        contentType: 'application/json',
        success: function (result) {
            location.reload();
        }
    });

}

function pickedUpCargo(id) {

    $.ajax({
        type: "POST",
        url: "/api/haulierbooking/" + id + "/pickedup",
        contentType: 'application/json',
        success: function (result) {
            location.reload();
        }
    });

}

function deliveredCargo(id) {

    $.ajax({
        type: "POST",
        url: "/api/haulierbooking/" + id + "/delivered",
        contentType: 'application/json',
        success: function (result) {
            location.reload();
        }
    });

}

