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
    image: {
      type: String,
      default: 'user.svg'
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

userSchema.post("init", (doc) => {
  if (doc.image) {
    const image = `${process.env.BASE_URL}/uploads/images/${doc.image}`;
    doc.image = image;
  }
});

userSchema.post("save", (doc) => {
  if (doc.image) {
    const image = `${process.env.BASE_URL}/uploads/images/${doc.image}`;
    doc.image = image;
  }
});



const User = mongoose.model("User", userSchema);

module.exports = User;
