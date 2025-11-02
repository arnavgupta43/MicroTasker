const amqp = require("amqplib");
let channel;
let connection;

async function connectRabbotMq() {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertExchange("event.exchange", "topic", { durable: true });
    console.log("Connected to rabbitMq");
  } catch (error) {
    console.error("Connection Failed to RabbitMq", error.message);
  }
}
function getChannel() {
  if (!channel) throw new error("RabbitMQ channel not initialized ");
  return channel;
}

module.exports = { connectRabbotMq, getChannel };
