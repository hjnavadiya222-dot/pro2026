import multer from "multer";

const storage = multer.memoryStorage();

export const singleUpload = (fieldName) =>
  multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
      const allowedTypes = ["image/", "application/pdf", "text/"];
      if (allowedTypes.some((type) => file.mimetype.startsWith(type))) {
        cb(null, true);
      } else {
        cb(new Error("Only image, PDF, and text files are allowed!"), false);
      }
    },
  }).single(fieldName);
