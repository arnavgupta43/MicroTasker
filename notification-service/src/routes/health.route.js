import express from "express";
import { isDbReady } from "../config/db.js";
import { isRabbitReady } from "../config/rabbitmq.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    ok: true,
    service: process.env.SERVICE_NAME,
  });
});

router.get("/ready", (req, res) => {
  const db = isDbReady();
  const rabbit = isRabbitReady();
  const ok = db && rabbit;
  res.status(ok ? 200 : 503).json({
    ok,
    service: process.env.SERVICE_NAME,
    checks: {
      db,
      rabbit,
    },
  });
});

export default router;
