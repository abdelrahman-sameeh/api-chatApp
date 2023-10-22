const User = require("../model/userModel");

module.exports = (io) => {
  io.on("connect", (socket) => {
    socket.on("getOnlineFriends", async (userId) => {
      const { friends } = await User.findById(userId, { friends: 1 }).populate({path: 'friends', select: 'name friendsChatId image'})
      const onlineFriends =
        friends && friends.length
          ? friends.filter((friend) => io.onlineUsers[friend._id])
          : [];
      socket.emit("returnOnlineFriends", onlineFriends);
    });
  });
};
