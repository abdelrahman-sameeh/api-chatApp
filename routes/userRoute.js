const express = require("express");
const {
  getLoggedUser,
  updateUserInfo,
  uploadImage,
  setImageInBody,
  removeImage
} = require("../services/userService");
const AuthService = require("../services/authService");
const router = express.Router();

// for user
router.get("/user", AuthService.protect, getLoggedUser);

router.post(
  "/updateUserInfo",
  AuthService.protect,
  uploadImage("image"),
  setImageInBody,
  updateUserInfo 
);

router.delete(
  "/removeImage",
  AuthService.protect,
  removeImage
)

module.exports = router;
