const kafka = require("./connect");
const EVENT = require("../models/event");
const ticketStatusEventProducer = require("./ticket-status-event-producer");
const ticketSuccessEventProducer = require("./ticket-success-event-producer");

async function bookSeat(event_id) {
    const event = await EVENT.findById(event_id);

    if(event.seats.booked < event.seats.total) {
        const updatedEvent = await EVENT.findByIdAndUpdate(
            event_id,
            {
                $set: {
                    "seats.booked": event.seats.booked + 1
                }
            }
        );

        return {
            status: "success"
        }
    } else {
        return {
            status: "failed"
        }
    }
}

async function cancelSeat(event_id) {
    const event = await EVENT.findById(event_id);

    if(event.seats.booked > 0) {
        const updatedEvent = await EVENT.findByIdAndUpdate(
            event_id,
            {
                $set: {
                    "seats.booked": event.seats.booked - 1
                }
            }
        ).catch(error => {
            console.error(error);
            return {
                status: "failed"
            }
        });

        return {
            status: "success"
        }
    } else {
        return {
            status: "failed"
        }
    }
}

async function startConsumer() {
    const consumer = kafka.kafka.consumer({ groupId: 'event-consumer-group' });
    await consumer.connect();
    consumer.subscribe({ topic: 'ticket-event' });

    consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                value: JSON.parse(message.value.toString()),
            });

            if(message.key.toString() == "booked") {
                let body = JSON.parse(message.value.toString());

                let result = await bookSeat(body.event_id);
                console.log(result);

                ticketStatusEventProducer.produceMessage(
                    result.status, 
                    JSON.stringify(body)
                );

                if(result.status == "success") {
                    ticketSuccessEventProducer.produceMessage(
                        result.status, 
                        JSON.stringify(body)
                    );
                }
            } else {
                let body = JSON.parse(message.value.toString());

                let result = await cancelSeat(body.event_id);
                console.log(result);

                ticketStatusEventProducer.produceMessage(
                    result.status, 
                    JSON.stringify(body)
                );

                if(result.status == "success") {
                    ticketSuccessEventProducer.produceMessage(
                        result.status, 
                        JSON.stringify(body)
                    );
                }
            }
        },
    });
}

module.exports = { startConsumer };