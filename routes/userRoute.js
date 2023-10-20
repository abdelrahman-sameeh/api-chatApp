const express = require("express");
const {
  getLoggedUser,
  updateUserInfo,
} = require("../services/userService");
const AuthService = require("../services/authService");
const router = express.Router();

// for user
router.get("/user", AuthService.protect, getLoggedUser);

router.post("/updateUserInfo", AuthService.protect, updateUserInfo);

module.exports = router;
