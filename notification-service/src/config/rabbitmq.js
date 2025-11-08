import amqp from "amqplib";
let channel;
let connect;

async function connectionRabbitMQ(retries = 10, delay = 5000) {
  while (retries) {
    try {
      connect = await amqp.connect(process.env.RABBITMQ_URL);
      await channel.assertExchange("events.exchange", "topic", {
        durable: true,
      });
      console.log("Connected to RabbotMq");
      return channel;
    } catch (error) {
      console.log("Faile to connect with RabbitMq", error.message);
      console.log(`Retrying in ${delay} ms `);
      retries -= 1;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  console.error("Failed to connect to rabbitMQ after 10 attempt");
  process.exit(1);
}

export function getConnection() {
  if (!channel) console.error("channel not initialised ");
  return channel;
}
export { connectionRabbitMQ };
