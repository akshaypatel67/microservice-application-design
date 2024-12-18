const mongoose = require("mongoose");

const eventImageSchema = new mongoose.Schema({
        event_id: {
            type: String,
            required: true,
        },
        images: [{
            type: Buffer,
            required: true,
        }],
    },
);

const EVENT_IMAGE = mongoose.model("event-image", eventImageSchema);

module.exports = EVENT_IMAGE;