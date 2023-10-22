const expressAsyncHandler = require("express-async-handler");
const Message = require("../model/messageModel");
const { createItem } = require("./handleFactory");
const Chat = require("../model/chatModel");

// get messages in chat
exports.getChat = expressAsyncHandler(async (req, res, next) => {
  const messages = await Message.find({ chatId: req.params.chatId });
  res.status(200).json({ data: messages });
});

exports.sendMessage = async (data) => {
  const chat = await Chat.findById(data.chatId);
    if (!chat) {
      return false
    }
  const response = await Message.create(data);
  if (response) {
    return true;
  }
};
