const { sendRequest } = require("../services/friendService");

module.exports = (io) => {
  io.on("connect", (socket) => {
    // add friend fun
    socket.on("addFriend", async (myId, friendId) => {
      socket.join(friendId);
      const response = await sendRequest(myId, friendId);
      if (response) {
        socket.emit("addFriendSuccessfully");
        socket.broadcast.to(friendId).emit("sendRequestNotification", response);
      }
    });
  });
};
