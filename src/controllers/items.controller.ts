// import { AuthenticatedRequest } from "#types/AuthenticatedRequest.js";
import { Item } from "../models/Item.js";
import { Request, RequestHandler, Response } from "express";
import cloudinary from "#config/cloudinary.js";
import { UploadApiResponse } from "cloudinary";
import { CreateItemDto } from "#types/Items.js";

export const getItems: RequestHandler = async (req: Request, res: Response) => {
  try {
    console.log("Get Items cookies:", req.cookies);
    const items = await Item.find({});
    res.status(200).json({
      items,
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const postItem: RequestHandler = async (
  req: Request<unknown, unknown, CreateItemDto>,
  res: Response
) => {
  try {
    console.log("Cookies en postItem:", req.cookies);
    console.log("Content-Type:", req.headers["content-type"]);
    const fileBuffer = req.file?.buffer;
    if (!fileBuffer) {
      throw Error();
    }

    const uploadResult = await uploadItemImage(fileBuffer);
    const urlImage = uploadResult.secure_url;
    const newItem = new Item({
      category: req.body.category,
      description: req.body.description,
      imgUrl: urlImage,
      name: req.body.name,
      price: req.body.price,
    });

    const savedItem = await newItem.save();

    res.status(201).json({
      message: "Item creado exitosamente",
      item: savedItem,
    });
    return;
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
  return;
};

export const uploadItemImage = async (
  fileBuffer: Buffer
): Promise<UploadApiResponse> => {
  return await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          transformation: [
            {
              quality: "auto",
              fetch_format: "auto",
            },
            {
              width: 1200,
              height: 1200,
              crop: "fill",
              gravity: "auto",
            },
          ],
          folder: "cafe-aroma/menu-items",
        },
        (error, uploadResult) => {
          if (error) {
            reject(new Error(error.message.toString()));
          }
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          resolve(uploadResult!);
        }
      )
      .end(fileBuffer);
  });
};
