const connectoToDB = require("./database/connect");
const kafka = require("./kafka/connect");
const createTicketEventConsumer = require("./kafka/create-ticket-event-consumer");

connectoToDB();
createTicketEventConsumer.startConsumer();

require('./server');