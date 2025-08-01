import { BaseUser } from "../types/BaseUser.js";
import mongoose, { model, Schema } from "mongoose";

interface IUser extends BaseUser {
  created_at: Date;
  _id: mongoose.Types.ObjectId;
}

const UserSchema = new Schema({
  created_at: Date,
  email: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  phone: String,
  role: {
    required: true,
    type: String,
  },
  username: {
    required: true,
    type: String,
  },
});

export const User = model<IUser>("User", UserSchema);
