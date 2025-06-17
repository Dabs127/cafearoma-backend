import { CreatePromotionDto } from "#types/Promotions.js";
import { UploadApiResponse } from "cloudinary";
import { Promotion } from "../models/Promotion.js";
import { Request, RequestHandler, Response } from "express";
import cloudinary from "#config/cloudinary.js";

export const getPromotions = async (req: Request, res: Response) => {
  try {
    const promotions = await Promotion.find({});
    console.log(promotions);
    res.status(200).json({
      promotions,
    });
  } catch (error) {
    console.error("Error fetching promotions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const postPromotion: RequestHandler = async (
  req: Request<unknown, unknown, CreatePromotionDto>,
  res: Response
) => {
  try {
    const fileBuffer = req.file?.buffer;
    if (!fileBuffer) {
      throw Error();
    }

    const uploadResult = await uploadPromotionImage(fileBuffer);
    const urlImage = uploadResult.secure_url;
    const newPromotion = new Promotion({
      endDate: req.body.endDate,
      longDescription: req.body.longDescription,
      shortDescription: req.body.shortDescription,
      imgUrl: urlImage,
      title: req.body.title,
      authenticationRequired: req.body.authenticationRequired,
      startDate: req.body.startDate,
    });

    const savedPromotion = await newPromotion.save();

    res.status(201).json({
      message: "Item creado exitosamente",
      promotion: savedPromotion,
    });
    return;
  } catch (error) {
    console.error("Error creating promotion:", error);
    res.status(500).json({ message: "Internal server error" });
  }
  return;
};

export const uploadPromotionImage = async (
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
          folder: "cafe-aroma/promotions",
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
