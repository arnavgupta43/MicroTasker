import User from "../models/user.model.js";
import publishUserEvent from "../queues/producer.js";

async function registerUser(username, name, email, password) {
  if (!username || !email || !name || !password) {
    throw new Error("Insufficient user details");
  }
  const existingEmail = await User.findOne({ email });
  const existingUsername = await User.findOne({ username });
  if (existingEmail || existingUsername) {
    throw new Error("User already exists");
  }
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
  if (!email || !password) throw new Error("Insufficient data");

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const isPasswordCorrect = await user.matchPassword(password);
  if (!isPasswordCorrect) throw new Error("Incorrect password");

  const token = user.createJWT();

  // return structured response instead of sending it
  return { username: user.getName(), token };
}

export { registerUser, loginUser };
