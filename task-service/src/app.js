import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import router from "./routes/task.routes";
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
});
const app = express();
app.use(cors());
app.use(limiter);
app.use(express.json());
app.use("/task", router);
export default app;
