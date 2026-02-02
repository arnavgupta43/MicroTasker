import { getChannel } from "../config/rabbitmq.js";
import logger from "../config/logger.js";
import { createNotification } from "../services/notification.service.js";
let consumerTag;

export async function consumeMessages() {
  const channel = getChannel();
  const queue = "notification.queue";
  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, "events.exchange", "user.*");
  await channel.bindQueue(queue, "events.exchange", "task.*");
  logger.info("Notification consumer waiting for messages");
  const { consumerTag: tag } = await channel.consume(queue, async (msg) => {
    if (!msg) return; // safety guard
    const data = JSON.parse(msg.content.toString());
    const requestId = data?.meta?.requestId || "missing";
    logger.info(
      {
        requestId,
        event: data.event,
        routingKey: msg.fields.routingKey,
      },
      "Consumed message",
    );
    try {
      switch (data.event) {
        case "created":
          if (data.payload.email) {
            await createNotification(
              "user.created",
              `New user registered: ${data.payload.email}`,
              data.payload.id,
            );
          } else if (data.payload.title) {
            await createNotification(
              "task.created",
              `New task created: ${data.payload.title}`,
              null,
              data.payload.id,
            );
          }
          break;
        case "assigned":
          await createNotification(
            "task.assigned",
            `Task ${data.payload.taskId} assigned to user ${data.payload.userId}`,
            data.payload.userId,
            data.payload.taskId,
          );
          break;
        default:
          logger.warn({ requestId, event: data.event }, "Unrecognized event");
      }
      channel.ack(msg);
    } catch (error) {
      logger.error(
        { requestId, error: error.message },
        "Error processing notification",
      );
      // Do NOT ack → message can be retried
    }
  });

  consumerTag = tag;
}
export async function stopConsumer() {
  const channel = getChannel();
  if (consumerTag) {
    await channel.cancel(consumerTag);
    logger.info("RabbitMQ consumer stopped gracefully");
  }
}
