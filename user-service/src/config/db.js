import mongoose from "mongoose";
let dbReady = false;
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    dbReady = true;
  } catch (error) {
    console.error("Error connecting to database:", error.message);
  }
};
export default connectDB;
export function isDbReady() {
  return dbReady && mongoose.connection.readyState === 1;
}