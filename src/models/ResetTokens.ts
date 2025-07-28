import { model, Schema } from "mongoose";

interface IResetToken {
  token: string;
  created_at: Date;
  expires_at: Date;
  user_id: string;
}

const ResetTokenSchema = new Schema({
  created_at: Date,
  token: {
    required: true,
    type: String,
  },
  expires_at: Date,
  user_id: {
    required: true,
    type: String,
  },
});

export const ResetToken = model<IResetToken>("ResetToken", ResetTokenSchema);
