import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import router from "./routes/task.routes.js";
import requestContext from "./middleware/requestContext.js";
import logger from "./config/logger.js";
import pinoHttp from "pino-http";
import healthRoutes from "./routes/health.routes.js";
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
});
const app = express();
app.use(cors());
app.use(limiter);
app.use(express.json());
app.use(requestContext);
app.use(
  pinoHttp({
    logger,
    customProps: (req) => ({
      requestId: req.requestId,
    }),
    serializers: {
      req(req) {
        return {
          method: req.method,
          url: req.url,
          requestId: req.requestId,
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use("/", healthRoutes);
app.use("/task", router);
export default app;
