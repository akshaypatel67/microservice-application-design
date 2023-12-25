const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const Auth = require("../models/auth");

dotenv.config();

const registerUser = asyncHandler(async (req, res) => {
    const { name, gender, age, email, password } = req.body;

    if(!name || !email || !password) {
        res.status(400).json({
            message: "Name, email and password is mandatory!"
        });
        throw new Error("Name, email and password is mandatory!");
    }

    const emailAlreadyPresent = await Auth.findOne({ email });
    if(emailAlreadyPresent) {
        res.status(400).json({
            message: "Email already registered!"
        });
        throw new Error("Email already registered!");
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log("hashed password: ", hashedPassword);

    const user = await Auth.create({
        name,
        gender,
        age,
        email,
        password: hashedPassword,
    });

    console.log(`user registered ${user}`);

    if(user) {
        res.status(201).json({ _id: user.id, email: user.email });
    } else {
        res.status(400).json({ message: "User data is invalid!" });
        throw new Error("User data is invalid!");
    }

    // res.json({ message: "User registered!" });
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        res.status(400).json({ message: "Email and Password required!" });
        throw new Error("Email and Password required!");
    }

    const user = await Auth.findOne({ email });
    // compare password with hashed password
    if(user && (await bcrypt.compare(password, user.password))) {
        // create JWTs
        const accessToken = jwt.sign(
            {
                user: {
                    username: user.name,
                    email: user.email,
                    id: user.id,
                },
                key: process.env.KEY
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            {
                user: {
                    username: user.name,
                    email: user.email,
                    id: user.id,
                },
                key: process.env.KEY
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
        );

        await user.updateOne({ refreshToken: refreshToken });

        res.cookie("jwt", refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).json({ accessToken });
    } else {
        res.status(401).json({ message: "Email or Password is invalid!" });
        throw new Error("Email or Password is invalid!");
    }
});

const currentUser = asyncHandler(async (req, res) => {
    res.json({ message: "Current user information" });
});

const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookies = req.cookies;

    console.log("cookies: ", cookies.jwt);
    if(!cookies?.jwt) return res.status(401).json({ message: "not authorized" });

    const refreshToken = cookies.jwt;
    
    const foundUser = await Auth.findOne({ refreshToken });
    
    if(!foundUser || !foundUser.refreshToken) {
        return res.sendStatus(403); // Forbidden
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        console.log(decoded.user);
        if(err || foundUser.email != decoded.user.email) {
            res.status(403).json({ message: "User is not authorized!" });
            throw new Error("User is not authorized!");
        }

        const accessToken = jwt.sign(
            {
                user: {
                    username: foundUser.name,
                    email: foundUser.email,
                    id: foundUser.id,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        res.status(200).json({ accessToken });
    });
});

const logoutUser = asyncHandler(async (req, res) => {
    const cookies = req.cookies;

    if(!cookies?.jwt) return res.status(204); // no content

    const refreshToken = cookies.jwt;

    // is refresh token in DB
    const foundUser = await Auth.findOneAndUpdate({ refreshToken }, {
        refreshToken: "",
    });

    res.clearCookie("jwt", { httpOnly: true });
    res.sendStatus(204);
});

module.exports = {
    registerUser,
    loginUser,
    currentUser,
    handleRefreshToken,
    logoutUser,
}