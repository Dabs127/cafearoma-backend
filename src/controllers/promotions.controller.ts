import { Promotion } from "../models/Promotion.js";
import { Request, Response } from "express";

export const getPromotions = async (req: Request, res: Response) => {
  try {
    const promotions = await Promotion.find({});
    console.log(promotions);
    res.json(promotions);
  } catch (error) {
    console.error("Error fetching promotions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
