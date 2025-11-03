import amqp from "amqplib";

let connection;
let channel;

async function connectRabbitMQ(retries = 10, delay = 5000) {
  while (retries) {
    try {
      connection = await amqp.connect(process.env.RABBITMQ_URL);
      channel = await connection.createChannel();
      await channel.assertExchange("events.exchange", "topic", {
        durable: true,
      });
      console.log(" Connected to RabbitMQ");
      return; // success, exit the loop
    } catch (err) {
      console.error(` RabbitMQ Connection Failed: ${err.message}`);
      retries -= 1;
      console.log(`Retrying in ${delay / 1000}s... (${retries} retries left)`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  console.error(" Could not connect to RabbitMQ after multiple attempts.");
  process.exit(1);
}

export function getChannel() {
  if (!channel) throw new Error("RabbitMQ channel not initialized");
  return channel;
}

export { connectRabbitMQ };
