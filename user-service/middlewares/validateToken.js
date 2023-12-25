const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;

    if(authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if(err) {
                res.status(403).json({ message: "User is not authorized!" });
                throw new Error("User is not authorized!");
            }

            req.user = decoded.user;
            console.log(decoded);
            next();
        });
    }

    if(!token) {
        res.status(401).json("User is not authorized or token is missing!");
        throw new Error("User is not authorized or token is missing!");
    }
});

module.exports = validateToken;