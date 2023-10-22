const { deleteFriend } = require("../services/friendService");

module.exports = (io) => {
  io.on("connect", (socket) => {
    socket.on("removeFromFriends", async (myId, friendId) => {
      socket.join(friendId);
      const response = await deleteFriend(myId, friendId);
      if (response) {
        socket.emit("removedFriendSuccessfully");
        socket.broadcast
          .to(friendId)
          .emit("removedFriendNotification", response);
      }
    });
  });
};
