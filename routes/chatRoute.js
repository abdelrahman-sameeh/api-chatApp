const express = require("express");
const { protect } = require("../services/authService");
const { getChat, createMessage } = require("../services/chatService");
const { addMessageValidator } = require("../validator/messageValidator");
const router = express.Router();

router.get("/chat/:chatId", protect, getChat);


module.exports = router;
