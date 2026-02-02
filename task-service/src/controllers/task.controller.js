import {
  createTask,
  assignTask,
  getAllTasks,
} from "../services/task.services.js";
import { StatusCodes } from "http-status-codes";
export const create = async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;
    const task = await createTask(
      title,
      description,
      assignedTo,
      req.requestId,
    );
    return res.status(StatusCodes.CREATED).json({ success: true, task });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: error.message });
  }
};
export const assign = async (req, res) => {
  try {
    const { taskId, userID } = req.body;
    const task = await assignTask(taskId, userID);
    return res.status(StatusCodes.OK).json({ success: true, task });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: error.message });
  }
};
export const getAll = async (req, res) => {
  try {
    const allTasks = await getAllTasks();
    return res.status(StatusCodes.CREATED).json({ success: true, allTasks });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: error.message });
  }
};
