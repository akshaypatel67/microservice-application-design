const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
        event_name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        date: {
            type: Number,
            required: false,
        },
        location: {
            type: String,
            required: false,
        },
        seats: {
            total: {
                type: Number,
                required: false
            },
            booked: {
                type: Number,
                required: false
            },
        },
        price: {
            type: mongoose.Types.Decimal128,
            required: true,
        },
        user_id: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const EVENT = mongoose.model("event", eventSchema);

module.exports = EVENT;