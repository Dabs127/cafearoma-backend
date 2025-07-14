import {
  CreatePromotionDto,
  DeleteIdPromotion,
  UpdatePromotionDto,
} from "#types/Promotions.js";
import { UploadApiResponse } from "cloudinary";
import { Promotion } from "../models/Promotion.js";
import { Request, RequestHandler, Response } from "express";
import cloudinary from "#config/cloudinary.js";
import { uploadImage } from "#utils/uploadToCloudinary.js";

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

export const getPromotionById: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    res.status(200).json({
      promotion,
    });
  } catch (error) {
    console.error("Erro getting item:", error);
    res.status(500).json({ message: "Error Devolviendo la info del item" });
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

export const updatePromotion: RequestHandler = async (
  req: Request<unknown, unknown, UpdatePromotionDto>,
  res: Response
) => {
  try {
    console.log("Cookies en postItem:", req.cookies);
    console.log("Content-Type:", req.headers["content-type"]);
    console.log(req.body);
    const fileBuffer = req.file?.buffer;
    const { id } = req.body;

    if (!id) throw new ReferenceError("Id was not given");

    let urlImage: string | undefined;

    if (fileBuffer) {
      const result = await Promotion.findById(id);

      if (!result) {
        res.status(404).json({
          message: `Promotion with id ${id.toString()} not found`,
        });
        return;
      }

      let substrings = result.imgUrl.split("upload");

      substrings = substrings[1].split("/");
      substrings.splice(0, 2);
      const finalString = substrings.join("/").split(".")[0];

      console.log(finalString);

      await cloudinary.uploader.destroy(finalString, (result) => {
        console.log(result);
      });

      const uploadResult = await uploadImage(
        fileBuffer,
        "cafe-aroma/promotions"
      );
      urlImage = uploadResult.secure_url;
    }

    const updates: Partial<UpdatePromotionDto> = {};
    const fields: (keyof UpdatePromotionDto)[] = [
      "endDate",
      "longDescription",
      "shortDescription",
      "startDate",
      "authenticationRequired",
      "title",
    ];

    for (const field of fields) {
      if (
        (field === "endDate" &&
          Object.prototype.hasOwnProperty.call(req.body, "endDate")) ||
        (field === "startDate" &&
          Object.prototype.hasOwnProperty.call(req.body, "startDate"))
      ) {
        updates[field] = new Date(req.body[field]);
      } else if (
        (field === "longDescription" &&
          Object.prototype.hasOwnProperty.call(req.body, "longDescription")) ||
        (field === "shortDescription" &&
          Object.prototype.hasOwnProperty.call(req.body, "shortDescription")) ||
        (field === "title" &&
          Object.prototype.hasOwnProperty.call(req.body, "title"))
      ) {
        updates[field] = req.body[field];
      } else if (
        field === "authenticationRequired" &&
        Object.prototype.hasOwnProperty.call(req.body, "authenticationRequired")
      ) {
        updates[field] = req.body[field];
      }
    }

    // Solo si hay imagen nueva
    if (urlImage) {
      updates.imgUrl = urlImage;
    }

    await Promotion.findByIdAndUpdate(id, updates);

    res.status(201).json({
      message: "Promoción actualizado exitosamente",
    });
    return;
  } catch (error) {
    console.error("Error creating item:", error);
    res
      .status(400)
      .json({ message: "Something gone wrong while updating the item" });
  }
  return;
};

export const deletePromotion: RequestHandler = async (
  req: Request<unknown, unknown, DeleteIdPromotion>,
  res: Response
) => {
  try {
    const { id } = req.body;

    if (!id) throw new ReferenceError("Id was not given");

    const result = await Promotion.findById(id);

    if (!result) {
      res.status(404).json({
        message: `Promotion with id ${id.toString()} not found`,
      });
      return;
    }

    let substrings = result.imgUrl.split("upload");

    substrings = substrings[1].split("/");
    substrings.splice(0, 2);
    const finalString = substrings.join("/").split(".")[0];

    console.log(finalString);

    await cloudinary.uploader.destroy(finalString, (result) => {
      console.log(result);
    });

    await Promotion.deleteOne({ _id: id });

    console.log("Eliminado con exito");

    res.status(200).json({
      success: true,
      message: "Promoción eliminada exitosamente",
    });
  } catch (err) {
    console.error(err);

    res.status(400).json({
      success: false,
      message: "Fallo el eliminar la promoción",
    });
  }
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
