import { getChannel } from "../config/rabbitmq";
export async function publishTaskEvent(eventType, data) {
  const channel = getChannel();
  const message = JSON.stringify({ event: eventType, payload: data });
  await channel.publish(
    "events.exchange",
    `task.${eventType}`,
    Buffer.from(message)
  );
  console.log(`Published event: task ${eventType}`);
}
