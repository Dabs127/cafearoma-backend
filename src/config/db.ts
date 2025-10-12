import mongoose from "mongoose";

const MONGO_URI =
  process.env.MONGO_URI

export async function connectDB() {

  if(!MONGO_URI){
    throw new Error("Variable a la base de datos no configurada")
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("DATABASE CONNECTED");
  } catch (error) {
    console.error("ERROR WHILE CONNECTING TO THE DATABASE", error);
    process.exit(1);
  }
}
