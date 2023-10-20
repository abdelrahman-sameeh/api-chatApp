const express = require("express");
const {
  sendRequest,
  cancelRequest,
  acceptRequest,
  deleteFriend,
} = require("../services/friendService");
const { protect } = require("../services/authService");
const { checkFriendIdValidator } = require("../validator/friendValidator");
const router = express.Router();

router.put("/sendRequest/:id", protect, checkFriendIdValidator, sendRequest);
router.put(
  "/cancelRequest/:id",
  protect,
  checkFriendIdValidator,
  cancelRequest
);
router.put(
  "/acceptRequest/:id",
  protect,
  acceptRequest
);
router.put("/deleteFriend/:id", protect, checkFriendIdValidator, deleteFriend);

module.exports = router;
