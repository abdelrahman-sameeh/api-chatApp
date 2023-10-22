const { rejectRequest } = require("../services/friendService");

module.exports = (io) => {
  io.on("connect", (socket) => {
    socket.on("rejectFriendRequest", async (myId, friendId) => {
      socket.join(friendId);
      const response = await rejectRequest(myId, friendId);
      if (response) {
        socket.emit("rejectRequestSuccessfully");
        socket.broadcast
          .to(friendId)
          .emit("rejectRequestNotification", response);
      }
    });
  });
};
