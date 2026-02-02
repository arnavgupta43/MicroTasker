import { getChannel } from "../config/rabbitmq.js";
async function publishUserEvent(eventType, data, requestId) {
  const channel = getChannel();
  const message = JSON.stringify({
    event: eventType,
    payload: data,
    meta: { requestId },
  });
  await channel.publish(
    "events.exchange",
    `user.${eventType}`,
    Buffer.from(message),
    {
      persistent: true,
      contentType: "application/json",
    },
  );
  console.log(`Published event: user.${eventType}`);
}
export default publishUserEvent;
