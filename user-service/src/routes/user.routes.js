import express from "express";
import { login, register } from "../controllers/user.controller.js";
const router = express.Router();

router.route("/u/login").post(login);
router.route("/u/register").post(register);
export default router;
