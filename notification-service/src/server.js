import express from "express";
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { connectionRabbitMQ } from "./config/rabbitmq.js";
dotenv.config();
const PORT = process.env.PORT || 5003;

(async () => {
  await connectDB();
  await connectionRabbitMQ();
  app.listen(PORT, () => console.log(`Task Service running on port ${PORT}`));
})();
