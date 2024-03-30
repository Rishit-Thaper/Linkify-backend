import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  api_secret: `${process.env.CLOUDINARY_API_SECRET}`,
});

const uploadOnCLoudinary = async (localFilePath) => {
  try {
    if (!file) {
      return null;
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    if (response) {
      fs.unlinkSync(localFilePath);
      console.log(response);
      return response;
    }
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.log(error);
    return null;
  }
};

export { uploadOnCLoudinary };
