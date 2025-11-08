import Notification from "../model/notification.model";
export async function createNotification(
  type,
  message,
  userId = null,
  taskId = null
) {
  const newNotification = await Notification.create({
    type,
    message,
    userId,
    taskId,
  });
  return newNotification;
}

export async function getNotificationByUser(userId) {
  const userNotification = await Notification.find({ userId }).sort({
    createdAt: -1,
  });
  return userNotification;
}
export async function getAllNotification() {
  return await Notification.find().sort({
    createdAt: -1,
  });
}

export async function deleteNotification(id) {
  const deleteNotification = await Notification.deleteOne({ _id: id });
  return deleteNotification;
}
