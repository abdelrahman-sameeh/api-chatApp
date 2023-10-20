const { default: mongoose } = require("mongoose");

const chatSchema = mongoose.Schema({});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
