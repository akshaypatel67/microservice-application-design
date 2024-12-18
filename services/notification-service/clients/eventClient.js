const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "./protos/event.proto";
const protoLoader = require("@grpc/proto-loader");

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

const eventService = grpc.loadPackageDefinition(packageDefinition).event.EventService;

const client = new eventService(
  "event-service:50051",
  grpc.credentials.createInsecure()
);

module.exports = client;