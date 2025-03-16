import { Request, Response } from "express-serve-static-core";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Set up storage engine with multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/photos"); // Set the destination directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${uuidv4()}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueSuffix); // Generate a unique filename
  },
});

// Configure multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB limit
});

const uploadPhoto = (
  req: MulterRequest,
  res: Response,
  fieldName?: string
): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const uploaded = upload.single(fieldName ?? "image");
    uploaded(req, res, (err) => {
      if (err) {
        console.error(`Upload error for field "${fieldName ?? "image"}":`, err);
        reject(err); // Reject the promise with the error
      } else if (req.file) {
        resolve(req.file.filename); // Resolve with the filename
      } else {
        console.warn(`No file uploaded for field "${fieldName ?? "image"}".`);
        resolve(null); // Resolve with null if no file was uploaded
      }
    });
  });
};

// Updated upload function for multiple fields
const uploadPhotos = (
  req: Request,
  res: Response,
  fieldConfig: { name: string; maxCount: number }[] = []
): Promise<{ [key: string]: string[] | null }> => {
  return new Promise((resolve, reject) => {
    const uploaded = upload.fields(fieldConfig); // Accept multiple fields
    uploaded(req, res, (err) => {
      if (err) {
        console.error(`Upload error:`, err);
        reject(err); // Reject the promise with the error
      } else if (req.files != undefined) {
        // Map the filenames for each field
        const fileData: { [key: string]: string[] | null } = {};
        fieldConfig.forEach((field) => {
          fileData[field.name] = (req.files as any)?.[field.name]
            ? (req.files as any)[field.name].map((file: Express.Multer.File) => file.filename)
            : null;
        });
        resolve(fileData); // Resolve with filenames
      } else {
        console.warn("No files were uploaded.");
        resolve({}); // Resolve with an empty object if no files were uploaded
      }
    });
  });
};

export = { uploadPhoto, uploadPhotos };
