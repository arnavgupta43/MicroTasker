import express from "express";
import notificationRoutes from "./routes/notificatio.route.js";
import cors from "cors";
import pinoHttp from "pino-http";
import logger from "./config/logger.js";
import rateLimit from "express-rate-limit";
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
});
const app = express();
app.use(express.json());
app.use(
  pinoHttp({
    logger,
  }),
);
app.use("/api/notifications", notificationRoutes);

export default app;
