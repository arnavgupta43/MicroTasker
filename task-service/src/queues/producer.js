import { getChannel } from "../config/rabbitmq.js";
export async function publishTaskEvent(eventType, data, requestId) {
  const channel = getChannel();
  const message = JSON.stringify({
    event: eventType,
    payload: data,
    meta: { requestId },
  });
  await channel.publish(
    "events.exchange",
    `task.${eventType}`,
    Buffer.from(message),
    {
      persistent: true,
      contentType: "application/json",
    },
  );
  console.log(`Published event: task ${eventType}`);
}
