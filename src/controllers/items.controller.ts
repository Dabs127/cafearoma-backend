import { Item } from "#models/Item.js";
import { Request, Response } from "express";

export const getItems = async (req: Request, res: Response) => {
  try {
    const items = await Item.find({});
    console.log(items);
    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
