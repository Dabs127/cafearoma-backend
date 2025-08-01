import { model, Schema } from "mongoose";

interface IPromotion {
  _id: string;
  endDate: Date;
  imgUrl: string;
  longDescription: string;
  shortDescription: string;
  startDate: Date;
  authenticationRequired: boolean;
  title: string;
}

const PromotionSchema = new Schema({
  endDate: {
    required: true,
    type: Date,
  },
  imgUrl: {
    type: String,
  },
  longDescription: {
    required: true,
    type: String,
  },

  shortDescription: {
    required: true,
    type: String,
  },
  startDate: {
    required: true,
    type: Date,
  },
  authenticationRequired: {
    required: true,
    type: Boolean,
  },
  title: {
    required: true,
    type: String,
  },
});

export const Promotion = model<IPromotion>("Promotion", PromotionSchema);
