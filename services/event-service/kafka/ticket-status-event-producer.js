const kafka = require("./connect");
const producer = kafka.producer;

async function produceMessage(key, message) {
    console.log(message);
    producer.send({
        topic: 'ticket-status-event', // topic name
        messages: [{
            key: key,
            value: message
        }],
    });
}

module.exports = {
    produceMessage
};