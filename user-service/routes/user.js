const express = require("express");
const { getUser } = require("../controllers/user");

const router = express.Router();

router.get("/get/:userId", getUser);

module.exports = router;