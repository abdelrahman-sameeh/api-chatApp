const expressAsyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/ApiError");

// @desc      get logged user
// @route     GET  /api/v1/user
// @access    public
exports.getLoggedUser = expressAsyncHandler(async (req, res, next) => {
  const response = await User.findById(req.user._id);
  res.status(200).json({
    data: response,
  });
});

// @desc      update user info
// @route     POST  /api/v1/updateUserInfo
// @access    private (auth)
exports.updateUserInfo = expressAsyncHandler(async (req, res, next) => {
  const email = req.user.email;
  const user = await User.findOne({ email });
  const check = await bcrypt.compare(req.body.password, user.password);

  const data = {};
  if (req.body.name) {
    data.name = req.body.name;
  }

  if (req.body.email) {
    data.email = req.body.email;
  }

  if (req.body.phone) {
    data.phone = req.body.phone;
  }

  if (!check) {
    return next(new ApiError("password is incorrect", 400));
  }

  const response = await User.findOneAndUpdate({ email }, data, {
    new: true,
  });
  return res.status(200).json({
    message: "update user profile successfully",
    data: {
      name: response.name,
      email: response.email,
      role: response.role,
      phone: response.phone,
    },
  });
});
