import dotenv from "dotenv";
import app from "./app.js";
import { connectionDB } from "./config/db.js";
import { connectionRabbitMQ, closeRabbitMQ } from "./config/rabbitmq.js";
import { consumeMessages } from "./consumer/consumer.js";
import { stopConsumer } from "./consumer/consumer.js";
import mongoose from "mongoose";
dotenv.config();
const PORT = process.env.PORT || 5003;
import logger from "./config/logger.js";
let server;

async function startServer() {
  await connectionDB();
  await connectionRabbitMQ();
  await consumeMessages();
  server = app.listen(PORT, () => {
    logger.info(`User Service running on port ${PORT}`);
  });
}

startServer();
async function gracefulShutdown(signal) {
  logger.info({ signal }, "Graceful shutdown initiated");
  if (server) {
    server.close(() => {
      logger.info("HTTP server closed");
    });
  }
  try {
    await stopConsumer();
  } catch (error) {
    logger.error("Failed to stop consuming message");
  }
  try {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed");
  } catch (err) {
    logger.error("Error closing MongoDB", err);
  }
  try {
    await closeRabbitMQ();
    logger.info("RabbitMQ connection closed");
  } catch (err) {
    logger.error("Error closing RabbitMQ", err);
  }
  process.exit(0);
}
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
