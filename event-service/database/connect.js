const mongoose = require("mongoose");

const connectoToDB = async() => {
    mongoose.connect("mongodb://event-service-db:27017/event-service", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    mongoose.connection
        .once("open", () => console.log("connected to MongoDB Database"))
        .on("error", error => console.log("database connection error: ", error));
}

module.exports = connectoToDB;