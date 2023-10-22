const expressAsyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const ApiError = require("../utils/ApiError");
const Chat = require("../model/chatModel");
const ApiFeature = require("../utils/ApiFeature");


// using in sockets
exports.sendRequest = async (myId, friendId) => {
  // 1- check if user exist (validation)
  // check if already sent
  let me = await User.findById(myId);
  if (me.requestsHasSent && me.requestsHasSent.includes(friendId)) {
    return next(new ApiError("You already sent request", 400));
  }

  if (me.requestsHasSent && me.friends.includes(friendId)) {
    return next(new ApiError("You already friends", 400));
  }

  // 2- put him in my requestsHasSent
  me = await User.findByIdAndUpdate(myId, {
    $addToSet: { requestsHasSent: friendId },
  });
  // 3- put me is his requestsHasReceived
  await User.findByIdAndUpdate(friendId, {
    $addToSet: { requestsHasReceived: myId },
  });

  return me;
};

exports.cancelRequest = async (myId, friendId) => {
  // 1- check if user exist (validation)

  // check if user have a request
  const me = await User.findById(myId);
  if (me.requestsHasSent && !me.requestsHasSent.includes(friendId)) {
    return next(new ApiError("No user send a request", 400));
  }

  // 2- delete him in my requestsHasSent
  await User.findByIdAndUpdate(myId, {
    $pull: { requestsHasSent: friendId },
  });
  // 3- delete me is his requestsHasReceived
  await User.findByIdAndUpdate(friendId, {
    $pull: { requestsHasReceived: myId },
  });

  return true;
};

exports.acceptRequest = async (myId, friendId) => {
  // 1- check if user exist (validation)
  // check if user have a request
  const me = await User.findById(myId);
  if (me.requestsHasReceived && !me.requestsHasReceived.includes(friendId)) {
    return false;
  }

  // create chat
  const chat = new Chat();
  await chat.save();

  // // 2- delete him in my requestsHasReceived and add for friends field
  const user = await User.findByIdAndUpdate(
    myId,
    {
      $pull: { requestsHasReceived: friendId },
      $addToSet: { friends: friendId },
      $set: { [`friendsChatId.${friendId}`]: chat._id },
    },
    { new: true }
  );
  // // 3- delete me is his requestsHasSent and add for friends field
  await User.findByIdAndUpdate(friendId, {
    $pull: { requestsHasSent: myId },
    $addToSet: { friends: myId },
    $set: { [`friendsChatId.${myId}`]: chat._id },
  });

  return user;
};

exports.deleteFriend = async (myId, friendId) => {
  const me = await User.findById(myId);

  if (me.friends && !me.friends.includes(friendId)) {
    return false;
  }

  // 2- delete him from my friends field
  await User.findByIdAndUpdate(myId, {
    $pull: { friends: friendId },
  });
  // 3- delete me is his friends field
  await User.findByIdAndUpdate(friendId, {
    $pull: { friends: myId },
  });

  return true;
};

exports.rejectRequest = async (myId, friendId) => {
  const me = await User.findById(myId);
  if (me.requestsHasReceived && !me.requestsHasReceived.includes(friendId)) {
    return false;
  }

  // // 2- delete him in my requestsHasReceived and add for friends field
  await User.findByIdAndUpdate(myId, {
    $pull: { requestsHasReceived: friendId },
  });
  // // 3- delete me is his requestsHasSent and add for friends field
  await User.findByIdAndUpdate(friendId, {
    $pull: { requestsHasSent: myId },
  });

  return true;
};

// get getFriendRequestReceived
exports.getFriendRequestReceived = expressAsyncHandler(
  async (req, res, next) => {
    const limit = req.query.limit || 1;
    const page = req.query.page || 1;
    const skip = +page > 0 ? (+page - 1) * +limit : 0;

    const { requestsHasReceived } = await User.findById(req.user._id, {
      requestsHasReceived: { $slice: [skip, skip + +limit] },
    }).populate({
      path: "requestsHasReceived",
      select: "name phone friendsChatId",
    });

    // to set pagination
    const user = await User.findById(req.user._id, {
      requestsHasReceived: 1,
    });

    const pageCount =
      user.requestsHasReceived.length > skip
        ? Math.ceil(user.requestsHasReceived.length / limit)
        : 1;

    res.status(200).json({
      data: requestsHasReceived,
      pageCount,
    });
  }
);

// get getFriendRequestSent
exports.getFriendRequestSent = expressAsyncHandler(async (req, res, next) => {
  const limit = req.query.limit || 1;
  const page = req.query.page || 1;
  const skip = +page > 0 ? (+page - 1) * +limit : 0;

  const { requestsHasSent } = await User.findById(req.user._id, {
    requestsHasSent: { $slice: [skip, skip + +limit] },
  }).populate({
    path: "requestsHasSent",
    select: "name phone friendsChatId",
  });

  // to set pagination
  const user = await User.findById(req.user._id, {
    requestsHasSent: 1,
  });

  const pageCount =
    user.requestsHasSent.length > skip
      ? Math.ceil(user.requestsHasSent.length / limit)
      : 1;

  res.status(200).json({
    data: requestsHasSent,
    pageCount,
  });
});

// get get logged user Friend
exports.getLoggedUserFriends = expressAsyncHandler(async (req, res, next) => {
  const limit = req.query.limit || 20;
  const page = req.query.page || 1;
  const skip = +page > 0 ? (+page - 1) * +limit : 0;

  const { friends } = await User.findById(req.user._id, {
    friends: { $slice: [skip, skip + +limit] },
  }).populate({
    path: "friends",
    select: "name phone friendsChatId image",
  });

  // to set pagination
  const user = await User.findById(req.user._id, {
    friends: 1,
  });

  const pageCount =
    user.friends.length > skip ? Math.ceil(user.friends.length / limit) : 1;

  res.status(200).json({
    data: friends,
    pageCount,
  });
});

// get all friends
exports.getAllFriends = expressAsyncHandler(async (req, res, next) => {
  const { friends } = await User.findById(req.user._id).populate({
    path: "friends",
    select: "name phone friendsChatId image",
  })

  res.status(200).json({
    data: friends,
  });
});


exports.getListOfUsers = expressAsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id, {
    friends: 1,
    requestsHasReceived: 1,
    requestsHasSent: 1,
  });

  const userFriends = [req.user._id];

  if (user.friends && user.friends.length) {
    userFriends.push(...user.friends);
  }
  if (user.requestsHasReceived && user.requestsHasReceived.length) {
    userFriends.push(...user.requestsHasReceived);
  }
  if (user.requestsHasSent && user.requestsHasSent.length) {
    userFriends.push(...user.requestsHasSent);
  }

  // get number of documents for this filter to send it to (apiFeature)
  const docCount = new ApiFeature(
    User.find({
      _id: { $nin: userFriends },
    }),
    req.query
  )
    .filter()
    .search()
    .sort()
    .limitFields();

  const docCountMongooseQuery = docCount.mongooseQuery;
  const documentCounts = await docCountMongooseQuery;

  const apiFeature = new ApiFeature(
    User.find({
      _id: { $nin: userFriends },
    }),
    req.query
  )
    .filter()
    .pagination(documentCounts.length)
    .search()
    .sort()
    .limitFields();

  const { mongooseQuery, paginationResults } = apiFeature;

  const response = await mongooseQuery;

  res.status(200).json({
    results: response.length,
    pagination: paginationResults,
    data: response,
  });
});
