const express = require("express");
const { registerUser, loginUser, currentUser, handleRefreshToken, logoutUser } = require("../controllers/auth");
const validateToken = require("../middlewares/validateToken");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/refresh", handleRefreshToken);

router.get("/current", validateToken, currentUser);

router.get("/logout", logoutUser);

module.exports = router;