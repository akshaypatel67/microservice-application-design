const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "./protos/event.proto";
const protoLoader = require("@grpc/proto-loader");
const eventController = require("./controllers/event");

const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const eventProto = grpc.loadPackageDefinition(packageDefinition).event;

const server = new grpc.Server();

server.addService(eventProto.EventService.service, {
    CreateEvent: eventController.createEvent,
    GetEvent: eventController.getEvent,
    UpdateEvent: eventController.updateEvent,
    DeleteEvent: eventController.deleteEvent,
    ListEvents: eventController.getAllEvents
});

module.exports = server;
