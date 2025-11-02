const { getChannel } = require("../config/rabbitmq");

async function publishUserEvent(eventType, data) {
  const channel = getChannel();
  const message = JSON.stringify({ event: eventType, payload: data });
  await channel.publish(
    "event.message",
    `user.${eventType}`,
    Buffer.from(message)
  );
  console.log(`Published event: user.${eventType}`);
}
module.exports = publishUserEvent;
