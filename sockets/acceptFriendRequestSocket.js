const { acceptRequest } = require("../services/friendService");

module.exports = (io) => {
  io.on("connect", (socket) => {
    socket.on("acceptFriendRequest", async (myId, friendId) => {
      // join to friend room
      socket.join(friendId);
      const response = await acceptRequest(myId, friendId);
      console.log(response);
      if (response) {
        socket.emit("acceptedSuccessfully");
        socket.broadcast
          .to(friendId)
          .emit("sendAcceptedRequestNotification", response);
      }
    });
  });
};
