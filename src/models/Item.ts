import { model, Schema } from "mongoose";

interface IItem {
  category: string;
  description: string;
  imgUrl: string;
  name: string;
  price: number;
}

const ItemSchema = new Schema({
  category: {
    required: true,
    type: String,
  },
  description: {
    required: true,
    type: String,
  },
  imgUrl: {
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  price: {
    required: true,
    type: Number,
  },
});

export const Item = model<IItem>("Item", ItemSchema);
