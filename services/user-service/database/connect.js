const mongoose = require("mongoose");

const connectoToDB = async() => {
    mongoose.connect("mongodb://user-service-db:27017/user-service", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    mongoose.connection
        .once("open", () => console.log("connected to MongoDB Database"))
        .on("error", error => console.log("database connection error: ", error));
}

module.exports = connectoToDB;