const { default: mongoose } = require("mongoose");

const messageSchema = mongoose.Schema({
  chatId: {
    type: mongoose.Schema.ObjectId,
    ref: "Chat",
  },
  content: String,
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
    default: new Date(Date.now()),
  },
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
