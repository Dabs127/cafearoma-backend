import mongoose from "mongoose";

const MONGO_URI =
  process.env.MONGO_URI ??
  "mongodb+srv://dabs:1234@cafearoma.stfhmxf.mongodb.net/?retryWrites=true&w=majority&appName=CafeAroma";

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("DATABASE CONNECTED");
  } catch (error) {
    console.error("ERROR WHILE CONNECTING TO THE DATABASE", error);
    process.exit(1);
  }
}
