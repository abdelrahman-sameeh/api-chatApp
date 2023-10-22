const { cancelRequest } = require("../services/friendService");

module.exports = (io) => {
  io.on("connect", (socket) => {
    socket.on("cancelRequest", async (myId, friendId) => {
      // join to friend room
      socket.join(friendId);
      const response = await cancelRequest(myId, friendId);
      if (response) {
        socket.emit("canceledSuccessfully");
        socket.broadcast.to(friendId).emit("renderFriendRequestsSentForFriendUser");
      }
    });
  });
};
