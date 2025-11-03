import express from "express";
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";
dotenv.config();
const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  await connectRabbitMQ();
  app.listen(PORT, () => console.log(`User Service running on port ${PORT}`));
})();
