const kafka = require("./connect");
// const producer = kafka.producer;

async function produceMessage(key, message) {
    console.log(kafka);
    console.log(message);
    kafka.producer.send({
        topic: 'upsert-data', // topic name
        messages: [{
            key: key,
            value: message
        }],
    });
}

module.exports = {
    produceMessage
};