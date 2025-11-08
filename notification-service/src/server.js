import express from "express";
import dotenv from "dotenv";
import app from "./app.js";
import { connectionDB } from "./config/db.js";
import { connectionRabbitMQ } from "./config/rabbitmq.js";
import { consumeMessages } from "./consumer/consumer.js";
dotenv.config();
const PORT = process.env.PORT || 5003;

(async () => {
  await connectionDB();
  await connectionRabbitMQ();
  await consumeMessages();
  app.listen(PORT, () => console.log(`Task Service running on port ${PORT}`));
})();
