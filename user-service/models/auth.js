const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, "username is required"],
        },
        gender: {
            type: String,
            enum: [ "Male", "Female", "Other" ]
        },
        age: {
            type: Number,
            min: [0, "invalid age"]
        },
        email: {
            type: String,
            required: [true, "email is required"],
            unique: [true, "email address already registered"],
        },
        password: {
            type: String,
            required: [true, "password is required"],
        },
        refreshToken: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

const Auth = mongoose.model("auth", authSchema);

module.exports = Auth;