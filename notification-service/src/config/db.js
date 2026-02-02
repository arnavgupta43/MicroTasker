import mongoose from "mongoose";
let dbReady = false;
const connectionDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
    dbReady = true;
  } catch (error) {
    console.error("Failed connection to MOngoDB", error.message);
    process.exit(1);
  }
};
function isDbReady() {
  return dbReady && mongoose.connection.readyState === 1;
}
export { connectionDB, isDbReady };
