import express from "express";
import notificationRoutes from "./routes/notification.routes.js";
import cors from "cors";
import rateLimit from "express-rate-limit";
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
});
const app = express();
app.use(express.json());
app.use("/api/notifications", notificationRoutes);

export default app;