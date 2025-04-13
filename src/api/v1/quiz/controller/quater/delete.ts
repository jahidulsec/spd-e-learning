import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import quaterService from '../../../../../lib/quater';
import { notFoundError, serverError } from "../../../../../utils/errors";


const del = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //Validate incoming body data with defined schema
    const validatedData = requiredIdSchema.parse(req.params);

    //get single item with validated id
    const data = await quaterService.getSingle(validatedData);

    if (!data) {
      notFoundError("Quater not found!");
    }

    const deleted: any = await quaterService.deleteOne(validatedData);

    if (deleted == 0) {
      serverError("Quater is not deleted");
    }

    const responseData = {
      success: true,
      message: "Quater is deleted successfully!",
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

export { del as delQuater };
