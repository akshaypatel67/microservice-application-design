const { throws } = require("assert");
const http = require("http");

const postData = JSON.stringify({ });

const options = {
    hostname: "kong",
    port: "8001",
    path: "/consumers/test/jwt",
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
    },
};

const RETRY_THRESHOLD = 20;
let retryCount = 1;

const configureJWT = async () => {
    if(retryCount == RETRY_THRESHOLD) {
        throw new Error("connection refused");
    }

    retryCount++;

    var retry = function(error) {
        console.error("Error: ", error.message);
        console.error("retrying...");
        setTimeout(function () {
            configureJWT(); //retry
        }, 10000);
    }


    let data = '';

    const request = http.request(options, (response) => {
        response.setEncoding('utf8');

        response
        .on('data', (chunk) => {
            data += chunk;
        })
        .on('end', () => {
            console.log(data);
            if (JSON.parse(data)?.message === "Not found") {
                request.emit('error', new Error("Invalid JSON response"));
            }
            process.env.ACCESS_TOKEN_SECRET = JSON.parse(data).secret;
            process.env.KEY = JSON.parse(data).key;
            console.log(process.env.KEY);
        });
    });

    request.on('error', retry);

    request.write(postData);

    request.end();
}

module.exports = configureJWT;