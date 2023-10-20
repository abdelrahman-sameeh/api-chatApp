const expressAsyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const ApiError = require("../utils/ApiError");
const Chat = require("../model/chatModel");

exports.sendRequest = expressAsyncHandler(async (req, res, next) => {
  // 1- check if user exist (validation)
  // check if already sent
  const me = await User.findById(req.user._id);
  if (me.requestsHasSent && me.requestsHasSent.includes(req.params.id)) {
    return next(new ApiError("You already sent request", 400));
  }

  if (me.requestsHasSent && me.friends.includes(req.params.id)) {
    return next(new ApiError("You already friends", 400));
  }

  // 2- put him in my requestsHasSent
  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { requestsHasSent: req.params.id },
  });
  // 3- put me is his requestsHasReceived
  await User.findByIdAndUpdate(req.params.id, {
    $addToSet: { requestsHasReceived: req.user._id },
  });

  return res.status(200).json({
    msg: "Send request successfully",
  });
});

exports.cancelRequest = expressAsyncHandler(async (req, res, next) => {
  // 1- check if user exist (validation)

  // check if user have a request
  const me = await User.findById(req.user._id);
  if (me.requestsHasSent && !me.requestsHasSent.includes(req.params.id)) {
    return next(new ApiError("No user send a request", 400));
  }

  // 2- delete him in my requestsHasSent
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { requestsHasSent: req.params.id },
  });
  // 3- delete me is his requestsHasReceived
  await User.findByIdAndUpdate(req.params.id, {
    $pull: { requestsHasReceived: req.user._id },
  });

  res.status(200).json({
    msg: "Canceled request successfully",
  });
});

exports.acceptRequest = expressAsyncHandler(async (req, res, next) => {
  // 1- check if user exist (validation)
  // check if user have a request
  const me = await User.findById(req.user._id);
  if (
    me.requestsHasReceived &&
    !me.requestsHasReceived.includes(req.params.id)
  ) {
    return next(new ApiError("No user send a request", 400));
  }

  // create chat
  const chat = new Chat();
  await chat.save();

  // // 2- delete him in my requestsHasReceived and add for friends field
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { requestsHasReceived: req.params.id },
    $addToSet: { friends: req.params.id },
    $set: { [`friendsChatId.${req.params.id}`]: chat._id },
  });
  // // 3- delete me is his requestsHasSent and add for friends field
  await User.findByIdAndUpdate(req.params.id, {
    $pull: { requestsHasSent: req.user._id },
    $addToSet: { friends: req.user._id },
    $set: { [`friendsChatId.${req.user._id}`]: chat._id },
  });

  res.status(200).json({
    msg: "Accepted request successfully",
  });
});

exports.deleteFriend = expressAsyncHandler(async (req, res, next) => {
  const me = await User.findById(req.user._id);

  if (me.friends && !me.friends.includes(req.params.id)) {
    return next(new ApiError("No friends match this id", 400));
  }

  // 2- delete him from my friends field
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { friends: req.params.id },
  });
  // 3- delete me is his friends field
  await User.findByIdAndUpdate(req.params.id, {
    $pull: { friends: req.user._id },
  });

  res.status(200).json({
    msg: "Deleted friend successfully",
  });
});

exports.rejectRequest = expressAsyncHandler(async (req, res, next) => {
  const me = await User.findById(req.user._id);
  if (
    me.requestsHasReceived &&
    !me.requestsHasReceived.includes(req.params.id)
  ) {
    return next(new ApiError("No user send a request", 400));
  }

  // // 2- delete him in my requestsHasReceived and add for friends field
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { requestsHasReceived: req.params.id },
  });
  // // 3- delete me is his requestsHasSent and add for friends field
  await User.findByIdAndUpdate(req.params.id, {
    $pull: { requestsHasSent: req.user._id },
  });

  res.status(200).json({
    msg: "Rejected request successfully",
  });
});
