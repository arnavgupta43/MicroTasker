import express from "express";
import { create, assign, getAll } from "../controllers/task.controller.js";
const router = express.Router();

router.route("/u/create").post(create);
router.route("/u/assign").post(assign);
router.route("/u/getAllTasks").get(getAll);
export default router;
