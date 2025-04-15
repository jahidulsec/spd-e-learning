import { Request, Response, NextFunction } from "express-serve-static-core";
import { requiredIdSchema } from "../../../../../schemas/required-id";
import quaterService from "../../../../../lib/quater";
import { notFoundError, unauthorizedError } from "../../../../../utils/errors";

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate incoming body data with defined schema
    const validatedData = requiredIdSchema.parse(req.params);

    //get single item with validated id
    const data = await quaterService.getSingle(validatedData);

    if (!data) {
      notFoundError("Quater not found!");
    }

    const responseData = {
      success: true,
      message: "Get quater details successfully!",
      data: data,
    };

    //send success response
    return res.status(200).json(responseData);
  } catch (error) {
    console.log("ERROR : ", error);

    //send error response
    next(error);
  }
};

export { get as getQuater };
