const express = require("express");
const server = require("./../server");
const router = express.Router();
router
  .route("/")
  .post(server.loginuser)
  .get(server.protect, server.getAllUsers);

module.exports = router;
