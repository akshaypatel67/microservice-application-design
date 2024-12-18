const express = require("express");
const { registerUser, loginUser, currentUser, handleRefreshToken, logoutUser, updateUser } = require("../controllers/auth");
const validateToken = require("../middlewares/validateToken");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/refresh", handleRefreshToken);

router.get("/current", validateToken, currentUser);

router.get("/logout", logoutUser);

router.post("/update", updateUser);

module.exports = router;