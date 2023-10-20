const { check } = require("express-validator");
const {
  validationResultMiddleware,
} = require("../middleware/validationResultMiddleware");
const User = require("../model/userModel");

exports.checkFriendIdValidator = [
  check("id")
    .isMongoId()
    .withMessage("Enter a valid ID")
    .custom(async (value, { req }) => {
      const friend = await User.findById(value);
      if (!friend || req.user._id.toString() === friend._id.toString()) {
        throw "Can't send request for this account";
      }
      return true;
    }),
  validationResultMiddleware,
];
