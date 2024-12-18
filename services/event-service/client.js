const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "./protos/event.proto";
const protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH);

const eventService = grpc.loadPackageDefinition(packageDefinition).event.EventService;

const client = new eventService(
  "event-service:50051",
  grpc.credentials.createInsecure()
);

const fs = require("fs");

const getImageData = (imagePath) => {
    return new Promise((resolve, reject) => {
      fs.readFile(imagePath, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
};

const imagePath = 'img.jpg';

// getImageData(imagePath)
//   .then((imageBuffer) => {
//     console.log(imageBuffer);
    client.CreateEvent(
      {
        name: "demo111",
        description: "this is a demo111",
        date: "17/11/2023",
        location: "Gandhinagar",
        total: 50,
        booked: 60,
        filename: "myimg",
        image: []
      },
      (error, message) => {
        if (error) throw error;
        console.log(message);
      }
    );
//   })
//   .catch((error) => {
//     console.error('Error reading image file:', error);
//   });



// client.UpdateEvent(
//   {
//     id: "65570cd910ad7c1cafdc6b8b",
//     // name: "demo2",
//     description: "this is a demo updated 1234",
//     // date: "17/11/2023",
//     // location: "Gandhinagar",
//   },
//   (error, message) => {
//     if (error) throw error;
//     console.log(message);
//   }
// );

// client.DeleteEvent(
//   {
//     id: "65570cd910ad7c1cafdc6b8b"
//   },
//   (error, message) => {
//     if (error) throw error;
//     console.log(message);
//   }
// )

// client.GetEvent(
//   {
//     id: "655ca8ddb3b41dfe9e8a6a97"
//   },
//   (error, message) => {
//     if (error) throw error;
//     console.log(message);
//   }
// )