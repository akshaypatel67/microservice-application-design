const kafkajs = require("kafkajs");
var producer;

const kafka = new kafkajs.Kafka({
    clientId: 'notification-producer',
    brokers: ["kafka-cluster.default.svc.cluster.local:9092"], // url 'kafka' is the host and port is 9092
    retry: {
        initialRetryTime: 5000,     // initial retry time in milliseconds
        maxRetryTime: 30000,       // maximum retry time in milliseconds
        retries: 20,                // maximum number of retries
    }
});

const connect = async() => {
    console.log("connect....");
    producer = kafka.producer();
    await producer.connect();
    console.log("connected....");
}

connect();

module.exports = {
    kafka,
    producer
};