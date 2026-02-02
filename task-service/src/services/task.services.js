import Task from "../models/task.model.js";
import { publishTaskEvent } from "../queues/producer.js";
export async function createTask(title, description, assignedTo) {
  if (!title || !description || !assignedTo) throw new Error("Invalid Request");
  const task = await Task.create({ title, description, assignedTo });
  await publishTaskEvent("created", {
    id: task._id,
    title: task.title,
    assignedTo: task.assignedTo,
    requestId,
  });
  return task;
}
export async function assignTask(taskId, username) {
  if (!taskId || !username) throw new Error("Invalid request");
  const task = await Task.findById(taskId);
  if (!task) throw new Error("No Task found");
  task.assignedTo = username;
  task.status = "in-progress";
  await task.save();
  await publishTaskEvent("assigned", { taskId: task._id, username });
  return task;
}
export async function getAllTasks() {
  return await Task.find();
}
