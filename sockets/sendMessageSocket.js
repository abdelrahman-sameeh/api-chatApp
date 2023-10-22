const { sendMessage } = require("../services/chatService");

module.exports = (io) => {
  io.on("connect", (socket) => {
    //
    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
    });

    socket.on("sendMessage", async (data) => {
      const response = await sendMessage(data);
      if (response) {
        io.to(data.chatId).emit("sendMessageSuccessfully");
        socket.broadcast.to(data.chatId).emit("applyRing");
      }
    });
  });
};
