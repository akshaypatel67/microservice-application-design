const kafka = require("./connect");
// const producer = kafka.producer;

async function produceMessage(key, message) {
    console.log(message);
    kafka.producer.send({
        topic: 'ticket-success-event', // topic name
        messages: [{
            key: key,
            value: message
        }],
    });
}

module.exports = {
    produceMessage
};