// import { AuthenticatedRequest } from "#types/AuthenticatedRequest.js";
import { Item } from "../models/Item.js";
import { Request, RequestHandler, Response } from "express";
import { CreateItemDto, DeleteIdItem, UpdateItemDto } from "#types/Items.js";
import { uploadImage } from "#utils/uploadToCloudinary.js";
import cloudinary from "#config/cloudinary.js";

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

export const getItemById: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const item = await Item.findById(req.params.id);
    res.status(200).json({
      item,
    });
  } catch (error) {
    console.error("Erro getting item:", error);
    res.status(500).json({ message: "Error Devolviendo la info del item" });
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

    const uploadResult = await uploadImage(fileBuffer, "cafe-aroma/menu-items");
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

export const deleteItem: RequestHandler = async (
  req: Request<unknown, unknown, DeleteIdItem>,
  res: Response
) => {
  try {
    const { id } = req.body;

    if (!id) throw new ReferenceError("Id was not given");

    const result = await Item.findById(id);

    if (!result) {
      res.status(404).json({
        message: `Item with id ${id.toString()} not found`,
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

    await Item.deleteOne({ _id: id });

    console.log("Eliminado con exito");

    res.status(200).json({
      success: true,
      message: "Item eliminado exitosamente",
    });
  } catch (err) {
    console.error(err);

    res.status(400).json({
      success: false,
      message: "Fallo el eliminar el item del menú",
    });
  }
};

export const updateItem: RequestHandler = async (
  req: Request<unknown, unknown, UpdateItemDto>,
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
      const result = await Item.findById(id);

      if (!result) {
        res.status(404).json({
          message: `Item with id ${id.toString()} not found`,
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
        "cafe-aroma/menu-items"
      );
      urlImage = uploadResult.secure_url;
    }

    const updates: Partial<UpdateItemDto> = {};
    const fields = ["category", "description", "name", "price"] as const;

    // Solo actualiza los campos que fueron enviados
    for (const field of fields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    // Solo si hay imagen nueva
    if (urlImage) {
      updates.imgUrl = urlImage;
    }

    await Item.findByIdAndUpdate(id, updates);

    res.status(201).json({
      message: "Item actualizado exitosamente",
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
