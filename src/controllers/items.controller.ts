// import { AuthenticatedRequest } from "#types/AuthenticatedRequest.js";
import { Item } from "../models/Item.js";
import { Request, RequestHandler, Response } from "express";

export const getItems: RequestHandler = async (req: Request, res: Response) => {
  // const userId = (req as AuthenticatedRequest).user;

  // if (!userId) res.status(401).json({ message: "No autorized" });

  try {
    const items = await Item.find({});
    res.status(200).json({
      items: items,
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
