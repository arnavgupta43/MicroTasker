import { getChannel } from "../config/rabbitmq.js";
async function publishUserEvent(eventType, data) {
  const channel = getChannel();
  const message = JSON.stringify({ event: eventType, payload: data });
  await channel.publish(
    "events.exchange",
    `user.${eventType}`,
    Buffer.from(message)
  );
  console.log(`Published event: user.${eventType}`);
}
export default publishUserEvent;
