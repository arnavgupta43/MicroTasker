//bind the user and task quesues to create notifications
import { getChannel } from "../config/rabbitmq.js";
import logger from "../config/logger.js";
import { createNotification } from "../services/notification.service.js";
export async function consumeMessages() {
  const channel = getChannel();
  const queue = "notification.queue";
  await channel.assertQueue(queue, { durable: true }); //create queue
  //blind to user and task queue
  await channel.bindQueue(queue, "events.exchange", "user.*");
  await channel.bindQueue(queue, "events.exchange", "task.*");
  console.log("Wasiting for messages");
  channel.consume(queue, async (msg) => {
    const data = JSON.parse(msg.content.toString()); //convert to JSON
    const requestId = data?.meta?.requestId || "missing";
    console.log("Received:", data);
    logger.info(
      { requestId, event: data.event, routingKey: msg.fields.routingKey },
      "Consumed message",
    );
    try {
      switch (
        data.event //create the notification accordingly to the event
      ) {
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
              `New Task created: ${data.payload.title}`,
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
          console.log("Event not recognized");
      }
      channel.ack(msg); //send the acknowledgement to the channel
    } catch (error) {
      console.error("Error processing message:", err.message);
    }
  });
}
