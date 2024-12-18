const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "./protos/ticket.proto";
const protoLoader = require("@grpc/proto-loader");

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

const ticketService = grpc.loadPackageDefinition(packageDefinition).ticket.TicketService;

const client = new ticketService(
  "ticket-service:50051",
  grpc.credentials.createInsecure()
);

module.exports = client;