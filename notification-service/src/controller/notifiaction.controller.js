import {
  deleteNotification,
  getAllNotification,
  getNotificationByUser,
} from "../services/notification.service.js";
import { StatusCodes } from "http-status-codes";
export const getAll = async (req, res) => {
  try {
    const notifiaction = await getAllNotification();
    return res.status(StatusCodes.OK).json({ success: true, notifiaction });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: error.message });
  }
};

export const getByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const notifiaction = await getNotificationByUser(id);
    return res.status(StatusCodes.OK).json({ success: true, notifiaction });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: error.message });
  }
};
export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const removeNotification = await deleteNotification(id);
    return res
      .status(StatusCodes.OK)
      .josn({ success: true, removeNotification });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, error: error.message });
  }
};
