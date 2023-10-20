const { default: mongoose, mongo } = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minLength: [2, "Too short user name"],
      maxLength: [25, "Too long user name"],
    },
    email: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
      minLength: [4, "Too short password"],
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      default: 'user'
    },
    account_status: {
      type: Boolean,
      default: true,
    },
    friends: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    requestsHasSent: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    requestsHasReceived: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    friendsChatId: {},
    changePasswordAt: Date,
    passwordResetCode: String,
    expirePasswordResetCode: Date,
    changePassword: Boolean,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
