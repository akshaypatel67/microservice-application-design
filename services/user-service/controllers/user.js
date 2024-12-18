const asyncHandler = require("express-async-handler");
const Auth = require("../models/auth");

const getUser = asyncHandler(async (req, res) => {
    const userId = req.params.userId;

    if(!userId) {
        res.status(400).json({
            message: "User ID is mandatory!"
        });
        throw new Error("User ID is mandatory!");
    }

    const user = await Auth.findOne({ email: userId }, {name: true, age:true, gender:true});

    if(user) {
        res.status(201).json(user);
    } else {
        res.status(400).json({ message: "User ID is invalid!" });
        throw new Error("User ID is invalid!");
    }

    // res.json({ message: "User registered!" });
});

module.exports = {
    getUser
}