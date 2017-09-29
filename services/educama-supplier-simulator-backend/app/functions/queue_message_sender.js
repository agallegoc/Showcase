
var amqp = require('amqplib/callback_api'); // AMQP -- RabbitMQ
var messageTransformer = require('./message_transformer');

var self = module.exports = {

    sentAirlineBookingtMessageToQueue: function (app, airlineBooking) {
        // Connect to RabbitMQ server
        amqp.connect(app.get('amqpURL'), function (err, conn) {
            // Create a channel
            conn.createChannel(function (err, ch) {
                var bookingResponseQueue = 'bookingResponseQueue';
                var msg = JSON.stringify(messageTransformer.getMessageFromAirlineBooking(airlineBooking));

                // Declare a queue for us to send to; then we can publish a message to the queue
                ch.assertQueue(bookingResponseQueue, { durable: false });
                ch.sendToQueue(bookingResponseQueue, new Buffer(msg));
            });
        });

    },

    sentHaulierBookingMessageToQueue: function (app, haulierBooking) {
        // Connect to RabbitMQ server
        amqp.connect(app.get('amqpURL'), function (err, conn) {
            // Create a channel
            conn.createChannel(function (err, ch) {
                var bookingResponseQueue = 'bookingResponseQueue';
                var msg = JSON.stringify(messageTransformer.getMessageFromHaulierBooking(haulierBooking));

                // Declare a queue for us to send to; then we can publish a message to the queue
                ch.assertQueue(bookingResponseQueue, { durable: false });
                ch.sendToQueue(bookingResponseQueue, new Buffer(msg));
            });
        });

    }
}