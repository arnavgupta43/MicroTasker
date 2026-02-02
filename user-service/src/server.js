import express from "express";
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { connectRabbitMQ, closeRabbitMQ } from "./config/rabbitmq.js";
dotenv.config();
const PORT = process.env.PORT || 5000;
import mongoose from "mongoose";
import logger from "./config/logger.js";
let server;

async function startServer() {
  await connectDB();
  await connectRabbitMQ();
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
    await mongoose.connection.close();
    logger.info("MongoDB connection closed");
  } catch (err) {
    logger.error("Error closing MongoDB", err);
  }

  // 3. Close RabbitMQ
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
