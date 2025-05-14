import { model, Schema } from "mongoose";

interface IUser {
  created_at: Date;
  email: string;
  password: string;
  phone_number: string;
  role: string;
  username: string;
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
  phone_number: String,
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
