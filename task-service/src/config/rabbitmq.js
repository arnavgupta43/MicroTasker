import amqp from "amqplib";
let channel;
let connection;
let channelReady = false;
async function connectionRabbitMq(retries = 10, delay = 5000) {
  while (retries) {
    try {
      connection = await amqp.connect(process.env.RABBITMQ_URL);
      channel = await connection.createChannel();
      await channel.assertExchange("events.exchange", "topic", {
        durable: true,
      });
      console.log(" Connected to RabbitMQ");
      channelReady = true;
      return; // success, exit the loop
    } catch (error) {
      console.log("Failed to connect with RabbitMQ", error.message);
      retries -= 1;
      console.log(`Retrying in ${delay / 1000}s... (${retries} retries left)`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  console.error("Failed to connect to rabbitMQ after 10 attempt");
  process.exit(1);
}

export function getChannel() {
  if (!channel) console.error("channel not initialized");
  return channel;
}
export function isRabbitReady() {
  return channelReady;
}
export { connectionRabbitMq };
