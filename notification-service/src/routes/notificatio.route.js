import express from "express";
const router = express.Router();
import {
  getAll,
  getByUser,
  remove,
} from "../controller/notifiaction.controller";
router.route("/").get(getAll);
router.route("/:userId").get(getByUser);
router.route("/:id").delete(remove);
export default router;
