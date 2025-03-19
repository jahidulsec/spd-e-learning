import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import cmsService from '../../../../../lib/folder';
import { notFoundError, serverError } from "../../../../../utils/errors";


const del = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //Validate incoming body data with defined schema
    const validatedData = requiredIdSchema.parse(req.params);

    //get single item with validated id
    const data = await cmsService.getSingle(validatedData);

    if (!data) {
      notFoundError("Folder not found!");
    }

    const deleted: any = await cmsService.deleteOne(validatedData);

    if (deleted == 0) {
      serverError("Folder is not deleted");
    }

    const responseData = {
      success: true,
      message: "Folder is deleted successfully!",
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

export { del as delFolder };
