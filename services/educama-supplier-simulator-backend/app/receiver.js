// AMQP -- RabbitMQ
var amqp = require('amqplib/callback_api');

var processor = require('./functions/message_processor');

module.exports = function(app) {
    amqp.connect(app.get('amqpURL'), function(err, conn) {
        // Create a channel
        conn.createChannel(function(err, ch) {
            var bookingRequestQueue = 'bookingRequestQueue';
            //if (closeOnErr(err)) return;
            ch.on("error", function(err) {
                console.error("[AMQP] channel error", err.message);
            });
            ch.on("close", function() {
                console.log("[AMQP] channel closed");
            });

            // Declare a queue to receive data;
            ch.assertQueue(bookingRequestQueue, {durable: false});
        
            //wait for income messages
            ch.consume(bookingRequestQueue, function(msg) {
                console.log("Received Message in the queue");
                processor.process_message(app, msg.content.toString());
            }, {noAck: true});
         });
    });
}