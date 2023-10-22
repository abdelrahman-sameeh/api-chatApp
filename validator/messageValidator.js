const { check } = require("express-validator");
const Chat = require("../model/chatModel");
const {
  validationResultMiddleware,
} = require("../middleware/validationResultMiddleware");

exports.addMessageValidator = [
  check("sender").custom((val, { req }) => {
    if (val !== req.user._id.toString()) {
      throw "sender must be same user";
    }
    return true;
  }),
  check("chatId").custom(async (val) => {
    const chat = await Chat.findById(val);
    if (!chat) {
      throw "No chat id match this id";
    }
    return true;
  }),
  validationResultMiddleware,
];
