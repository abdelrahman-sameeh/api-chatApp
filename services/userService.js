const expressAsyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/ApiError");
const multer = require("multer");

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
  if (req.body.image) {
    data.image = req.body.image;
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
      image: response.image
    },
  });
});

exports.uploadImage = (field)=> {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/images/");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
    },
  });
  let upload = multer({ storage: storage });
  return upload.single(field);
};

exports.setImageInBody = (req, res, next) => {
  if(req.file){
    req.body.image = req.file.filename
  }
  next()
};
