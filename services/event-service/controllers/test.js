const connectoToDB = require("../database/connect");
connectoToDB();
const EVENT_IMAGE = require("../models/event-image");
const fs = require("fs");

async function fun() {
    const imageDoc = await EVENT_IMAGE.findById("655ca0a33ad5f6d56ab23ac5");
    console.log(typeof(imageDoc.image_data));
    fs.writeFileSync("img.jpg", imageDoc.image_data);
}

fun();