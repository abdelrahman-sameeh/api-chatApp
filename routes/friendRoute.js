const express = require("express");
const {
  getFriendRequestReceived,
  getFriendRequestSent,
  getLoggedUserFriends,
  getListOfUsers,
  getAllFriends,
} = require("../services/friendService");
const { protect } = require("../services/authService");
const router = express.Router();

router.get("/friendRequestReceived", protect, getFriendRequestReceived);
router.get("/friendRequestSent", protect, getFriendRequestSent);
router.get("/friends", protect, getLoggedUserFriends);

router.get("/listOfUsers", protect, getListOfUsers);

router.get('/getAllFriends', protect, getAllFriends)

module.exports = router;
