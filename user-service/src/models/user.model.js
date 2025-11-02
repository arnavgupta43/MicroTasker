const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: [true, "Username must be unique"],
      required: [true, "Username is Required"],
      minlength: 10,
    },
    email: {
      type: String,
      unique: [true, "Email must be unique"],
      required: [true, "Email is required"],
      lowercase: [true, "Email should be in lower case"],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    name: {
      required: [true, "Name is required"],
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  {
    timestamps: true,
  }
);
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = function (enteredpassword) {
  return bcryptjs.compare(enteredpassword, this.password);
};

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { username: this.username, _id: this._id },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    }
  );
};

UserSchema.methods.getName = function () {
  return this.username;
};
module.exports = mongoose.model("User", UserSchema);
