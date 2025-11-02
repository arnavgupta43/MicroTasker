const User = require("../models/userModel");
const { publishUserEvent } = require("../queues/producer");
async function registerUser(username, name, email, password) {
  if (!username || !email || !name || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ status: "Failed", msg: "Insuffisent details" });
  }
  const existingEmail = await User.findOne({ email });
  const existingUsername = await User.findOne({ username });
  if (existingEmail || existingUsername) throw new Error("user already exists");

  const user = await User.create({
    username,
    email,
    name,
    password,
  });
  if (!user) throw new Error("Unable to create user");
  await publishUserEvent("created", { id: user._id, email: user.email });
  return user;
}

async function loginUser(email, password) {
  if (!username || !password) throw new Error("InSufficent Data");
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  const isPasswordCorrect = await user.matchPassword(password);
  if (!isPasswordCorrect) throw new Error("Incorrect password");
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ username: user.getName(), token });
  return { user, token };
}

module.exports = {
  registerUser,
  loginUser,
};
