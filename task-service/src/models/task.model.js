import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      min: [5, "Minimum length should be 5"],
    },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    assignedTo: { type: String, required: true }, // userId or username
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Task", taskSchema);
