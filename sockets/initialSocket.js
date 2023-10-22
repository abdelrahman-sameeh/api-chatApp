const { sendRequest } = require("../services/friendService");

module.exports = (io) => {
  io.on("connect", (socket) => {
    socket.on("joined", (myId) => {
      socket.join(myId);
      io.onlineUsers[myId] = true;
      socket.on("disconnect", () => {
        delete io.onlineUsers[myId];
      });
    });
  });
};
