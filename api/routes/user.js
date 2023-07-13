const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const User = require("../../model/user");
const {
  create_User,
  login_User,
  delete_User,
} = require("../../controllers/user");

router.post("/signup", create_User);

router.post("/login", login_User);

router.delete("/:userId", delete_User);

module.exports = router;
