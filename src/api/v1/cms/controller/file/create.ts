import { Request, Response, NextFunction } from "express-serve-static-core";
import { createFileDTOSchema } from "../../../../../schemas/file";
import cmsService from "../../../../../lib/file";
import upload from "../../../../../utils/upload";
import { badRequestError } from "../../../../../utils/errors";
import deleteImage from "../../../../../utils/delete-image";

const create = async (req: Request, res: Response, next: NextFunction) => {
  let uploadedFile: any | null = "";

  try {
    uploadedFile = await upload.uploadPhoto(req, res, "file");

    const formData = req.body;

    if (!uploadedFile) {
      badRequestError("file field required");
    }

    // get filename and file type
    formData["filename"] = uploadedFile.filename;
    formData["file_type"] = uploadedFile.mimeType;

    //Validate incoming body data with defined schema
    const validatedData = createFileDTOSchema.parse(formData);

    //create new with validated data
    const created = await cmsService.createNew(validatedData);

    const responseData = {
      success: true,
      message: "New File created successfully!",
      data: {
        ...created,
        file_path: `${req.protocol}://${req.get("host")}/uploads/files/${
          created.filename
        }`,
      },
    };

    //send success response
    res.status(201).json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //delete uploaded photo is item isn't created
    if (uploadedFile) {
      deleteImage({ folder: "files", image: uploadedFile.filename || "" });
    }

    //send error response
    next(error);
  }
};

export { create as createFile };
