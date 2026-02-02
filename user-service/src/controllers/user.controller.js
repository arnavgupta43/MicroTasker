import { registerUser, loginUser } from "../services/user.service.js";
import { StatusCodes } from "http-status-codes";
const register = async (req, res) => {
  try {
    const { username, name, email, password } = req.body;
    const user = await registerUser(
      username,
      name,
      email,
      password,
      req.requestId,
    );
    res.status(StatusCodes.CREATED).json({ success: true, user });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await loginUser(email, password);
    return res.status(StatusCodes.OK).json({ success: true, ...data });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: error.message });
  }
};
export { register, login };
