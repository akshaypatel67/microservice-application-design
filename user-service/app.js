const express = require("express");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");

const connectoToDB = require("./database/connect");
const configureJWT = require("./configure-kong");

const app = express();
const PORT = 8001;

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

connectoToDB();
configureJWT();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("user-service server");
});

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.listen(PORT, () => console.log(`server listening at port: ${PORT}`));
