//mongodb connection
import mongoose from "mongoose";
let dbReady = false;
const connectionDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    dbReady = true;
  } catch (error) {
    console.error("MongoDB connection error", error.message);
  }
};
export function isDbReady() {
  return dbReady && mongoose.connection.readyState === 1;
}
export default connectionDB;
