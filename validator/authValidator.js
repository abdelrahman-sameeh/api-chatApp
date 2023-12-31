const { check } = require("express-validator");
const User = require("../model/userModel");
const {
  validationResultMiddleware,
} = require("../middleware/validationResultMiddleware");

exports.registerValidator = [
  check("name")
    .notEmpty()
    .withMessage("user name is required")
    .isLength({ min: 2 })
    .withMessage("Too short user name")
    .isLength({ max: 30 })
    .withMessage("Too long user name"),
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Enter a valid email")
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email });
      if (user) {
        throw "this email already used";
      }
      return true;
    }),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG"])
    .withMessage("accept only EGY phone number")
    .custom(async (phone) => {
      const user = await User.findOne({ phone });
      if (user) throw "this phone already used";
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 4 })
    .withMessage("Too short password"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("password confirmation is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw "password not match with confirm password";
      }
      return true;
    }),
  validationResultMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Enter a valid email"),
  check("password").notEmpty().withMessage("password is required"),
  validationResultMiddleware,
];
