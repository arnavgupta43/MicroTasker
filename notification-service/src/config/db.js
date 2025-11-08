import mongoose from "mongoose";

const connectionDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Failed connection to MOngoDB", error.message);
    process.exit(1);
  }
};
export { connectionDB };
