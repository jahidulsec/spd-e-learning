import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import cmsService from '../../../../../lib/file';
import { notFoundError, serverError } from "../../../../../utils/errors";
import deleteImage from "../../../../../utils/delete-image";


const del = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //Validate incoming body data with defined schema
    const validatedData = requiredIdSchema.parse(req.params);

    //get single item with validated id
    const data = await cmsService.getSingle(validatedData);

    if (!data) {
      notFoundError("File not found!");
    }

    const deleted: any = await cmsService.deleteOne(validatedData);

    if (deleted == 0) {
      serverError("File is not deleted");
    }

     // delete previous file
     if (data?.filename) {
      deleteImage({ folder: "files", image: data.filename });
    }

    const responseData = {
      success: true,
      message: "File is deleted successfully!",
      data: data,
    };

    //send success response
    res.status(200).json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { del as delFile };
