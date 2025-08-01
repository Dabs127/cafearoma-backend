import { UploadApiResponse } from "cloudinary";
import cloudinary from "#config/cloudinary.js";

export const uploadImage = async (
  fileBuffer: Buffer,
  folderDirection: string
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
          folder: folderDirection,
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
