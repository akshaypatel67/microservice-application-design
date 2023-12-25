const grpc = require("@grpc/grpc-js");
const server = require('./service');

const PORT = 50051;

server.bindAsync(
    `0.0.0.0:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
        console.log(`Server running at http://0.0.0.0:${PORT}`);
        server.start();
    }
);
