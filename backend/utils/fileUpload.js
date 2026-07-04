import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "./cloudinary.js";
import getDataUri from "./datauri.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadFile = async (file, folderName = "uploads") => {
  const isCloudinaryConfigured =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (isCloudinaryConfigured) {
    const fileUri = getDataUri(file);
    const uploadResult = await cloudinary.uploader.upload(fileUri.content, {
      folder: folderName,
      resource_type: "auto",
    });
    return {
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url,
    };
  } else {
    // Local Fallback
    const uploadsDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    const uploadPath = path.join(uploadsDir, filename);
    fs.writeFileSync(uploadPath, file.buffer);

    return {
      public_id: filename,
      url: `http://localhost:8000/uploads/${filename}`,
    };
  }
};

export const deleteFile = async (public_id) => {
  const isCloudinaryConfigured =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (isCloudinaryConfigured) {
    await cloudinary.uploader.destroy(public_id);
  } else {
    // Local Fallback
    const localPath = path.join(__dirname, "../uploads", public_id);
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }
  }
};
