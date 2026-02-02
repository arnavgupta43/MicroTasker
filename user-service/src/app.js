import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import router from "./routes/user.routes.js";
import requestContext from "./middlewares/requestContext.js";
import logger from "./config/logger.js";
import pinoHttp from "pino-http";
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
});
const app = express();
app.use(cors());
app.use(limiter);
app.use(express.json());
app.use(requestContext);

// 2) structured HTTP logs
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
app.use("/auth", router);
export default app;
